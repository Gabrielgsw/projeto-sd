const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const amqp = require('amqplib');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3002;

let channel = null;
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672';
const QUEUE_NAME = 'notifications_queue';

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();    
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    console.log('[RABBITMQ] NewsService conectado e pronto para enviar mensagens!');
  } catch (error) {
    console.error('[RABBITMQ] Erro ao conectar (tentando novamente em 5s):', error.message);
    setTimeout(connectRabbitMQ, 5000);
  }
}
connectRabbitMQ();

app.use(cors());
app.use(express.json());

// fução auxiliar para noticias que irão gerar alertas
function isSevere(text) {
  if (!text) return false;
  
  const alertKeywords = [
    
    'alerta', 'risco', 'urgente', 'perigo', 'atenção', 'aviso',    
    'tempestade', 'defesa civil', 'enchente', 'inundação', 'vendaval', 
    'granizo', 'ciclone', 'onda de calor', 'chuva', 'deslizamento', 'trovoada', 'raios',    
    'clima', 'meteorologia', 'previsão do tempo', 'tempo nublado', 'pancadas', 'umidade','recife', 'polícia', 'operação', 'bilheteria', 'cinema' // inserindo outras palavras para teste
  ];
  
  const lowerText = text.toLowerCase();
  return alertKeywords.some(keyword => lowerText.includes(keyword));
}

app.get('/', (req, res) => {
  res.send('NewsService (Weather Focused) is running on port ' + PORT);
});

app.get('/news/:city', async (req, res) => {
  const { city } = req.params;
  
  if (!city) {
    return res.status(400).json({ error: "O parâmetro 'city' é obrigatório." });
  }

  try {
    // cache com redis
    const cacheTime = new Date(Date.now() - 4 * 60 * 60 * 1000);

    const localNews = await prisma.news.findMany({
      where: {
        city: city,
        createdAt: { gt: cacheTime }
      },
      orderBy: { pubDate: 'desc' },
      take: 5
    });

    /*if (localNews.length > 0) {
      console.log(`[CACHE] Retornando notícias locais para: ${city}`);
      return res.json(localNews);
    }
    */
   
    console.log(`[API] Buscando notícias de clima para: ${city}`);
    
    
    const fullQuery = `${city} AND Pernambuco`; 

    const response = await axios.get('https://newsdata.io/api/1/news', {
      params: {
        apikey: process.env.NEWS_API_KEY,
        q: fullQuery, 
        country: 'br',
        language: 'pt'
      }
    });
    const apiResults = response.data.results;

    if (!apiResults || apiResults.length === 0) {
      return res.json([]); 
    }

    
    const newsToSave = [];

    // percorre as noticias e salva no banco
    for (const item of apiResults) {
      if (!item.link || !item.title) continue;

      
      newsToSave.push({
        city: city,
        title: item.title,
        link: item.link,
        description: item.description ? item.description.substring(0, 500) : "Ver notícia completa",
        imageUrl: item.image_url,
        source: item.source_id,
        pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
      });

      //  Verifica se a notícia é severa e envia alerta     
      const textToAnalyze = `${item.title} ${item.description || ''}`;

      if (isSevere(textToAnalyze)) {
        console.log(`[ALERTA] Notícia de clima detectada: "${item.title}"`);
        
        if (channel) {
          const payload = JSON.stringify({
            userId: 1, 
            city: city,            
            message: `NOTÍCIA EM ${city.toUpperCase()}: ${item.title}`
          });
          //envia para a fila
          channel.sendToQueue(QUEUE_NAME, Buffer.from(payload));
          console.log(`[RABBITMQ] Enviado para a fila: ${city}`);
        } else {
          console.error('[ERRO] RabbitMQ não está pronto, alerta perdido.');
        }
      }
    }

    // salva no db
    if (newsToSave.length > 0) {
      await prisma.news.createMany({
        data: newsToSave,
        skipDuplicates: true, 
      });
    }

    return res.json(newsToSave);

  } catch (error) {
    console.error("Erro no NewsService:", error.message);
    
    const oldNews = await prisma.news.findMany({
      where: { city: city },
      orderBy: { pubDate: 'desc' },
      take: 5
    });

    return res.json(oldNews);
  }
});

app.listen(PORT, () => {
  console.log(`NewsService rodando na porta ${PORT}`);
});