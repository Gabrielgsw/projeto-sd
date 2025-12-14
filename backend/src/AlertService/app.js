const express = require('express');
const cors = require('cors'); 
const amqp = require('amqplib');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();

app.use(cors()); 
app.use(express.json());

const PORT = process.env.PORT || 3004;
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672';
const QUEUE_NAME = 'notifications_queue';

let channel = null;

// inicia conexão com o Rabbit
async function startRabbitMQ() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    
    // Garante que a fila existe
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    console.log('[RABBITMQ] Conectado e aguardando mensagens...');

    // consumer
    channel.consume(QUEUE_NAME, async (msg) => {
      if (msg !== null) {
        const conteudo = JSON.parse(msg.content.toString());
        console.log(`[WORKER] Processando alerta para User ${conteudo.userId}: ${conteudo.city}`);

        try {

          const duplicado = await prisma.alert.findFirst({
            where: {
              userId: conteudo.userId || 1,
              message: conteudo.message,              
              createdAt: {
                gt: new Date(Date.now() - 24 * 60 * 60 * 1000) 
              }
            }
          });

          if (duplicado) {
            console.log(`[WORKER] Alerta duplicado ignorado: ${conteudo.message.substring(0, 30)}...`);
            channel.ack(msg); // Remove da fila, duplicado
            return; 
          }
          
          await prisma.alert.create({
            data: {
              userId: conteudo.userId || 1, 
              city: conteudo.city || 'Desconhecida',
              message: conteudo.message
            }
          });

          
          channel.ack(msg); 
        } catch (err) {
          console.error('[WORKER] Erro ao salvar no banco:', err);
          
        }
      }
    });

  } catch (error) {
    console.error('[RABBITMQ] Erro de conexão:', error);
    setTimeout(startRabbitMQ, 5000); 
  }
}

startRabbitMQ();



// get alertas por user
app.get('/alerts/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);

  try {
    const alerts = await prisma.alert.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar alertas" });
  }
});

app.listen(PORT, () => console.log(`Alert Service rodando na porta ${PORT}`));