const express = require('express');
const amqp = require('amqplib');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3004;
const RABBITMQ_URL = process.env.RABBITMQ_URL;
let channel = null;

// Conecta no RabbitMQ
async function connectRabbit() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue('notifications_queue'); // Cria a fila se não existir
    console.log('[ALERT] Conectado ao RabbitMQ');
  } catch (error) {
    console.error('[ALERT] Erro RabbitMQ:', error);
    setTimeout(connectRabbit, 5000); // Tenta de novo em 5s
  }
}
connectRabbit();

// Recebe o alerta do NewsService ou WeatherService
app.post('/alerts', (req, res) => {
  const { userId, message } = req.body;

  if (!channel) return res.status(500).json({ error: 'RabbitMQ indisponível' });

  const payload = JSON.stringify({ userId, message });
  
  // Publica na fila
  channel.sendToQueue('notifications_queue', Buffer.from(payload));
  console.log(`[ALERT] Mensagem enviada para fila: User ${userId}`);

  res.status(200).send({ status: 'Enviado para processamento' });
});

app.listen(PORT, () => console.log(`Alert Service rodando na porta ${PORT}`));