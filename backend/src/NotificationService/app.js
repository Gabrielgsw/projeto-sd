const amqp = require('amqplib');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express'); 
const cors = require('cors');       
const app = express();              
const PORT = process.env.PORT || 3005
app.use(cors());
app.use(express.json());
const RABBITMQ_URL = process.env.RABBITMQ_URL;

// Rota para o React buscar notificações de um usuário
app.get('/notifications/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { createdAt: 'desc' }
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar notificações' });
  }
});

async function startConsumer() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    const queue = 'notifications_queue';

    await channel.assertQueue(queue);
    console.log(`[NOTIF] Aguardando mensagens na fila: ${queue}`);

    // Processa cada mensagem que chega
    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const content = JSON.parse(msg.content.toString());
        console.log(`[NOTIF] Processando alerta para User ${content.userId}`);

        try {
          // Grava no Banco (FINALMENTE!)
          await prisma.notification.create({
            data: {
              userId: content.userId,
              message: content.message,
              read: false
            }
          });
          
          // Confirma para o Rabbit que deu certo (Ack)
          channel.ack(msg);
        } catch (dbError) {
          console.error('[NOTIF] Erro ao salvar no banco:', dbError);
          // Opcional: não dar ack para tentar de novo depois (nack)
        }
      }
    });
  } catch (error) {
    console.error('[NOTIF] Erro de conexão:', error);
    setTimeout(startConsumer, 5000);
  }
}


startConsumer();

app.listen(PORT, () => {
  console.log(`Notification API rodando na porta ${PORT}`);
  // O consumidor já foi iniciado pela chamada startConsumer() lá em cima
});