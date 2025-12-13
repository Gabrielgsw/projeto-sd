const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3002;
// URL do Alert Service (definida no docker-compose)
const ALERT_SERVICE_URL = process.env.ALERT_SERVICE_URL || 'http://alert-service:3004';

app.use(cors());
app.use(express.json());

// --- FUNÇÃO AUXILIAR DE ALERTA (NOVO) ---
function isSevere(title) {
  const alertKeywords = [
    'alerta', 'risco', 'tempestade', 'urgente', 'perigo', 
    'defesa civil', 'enchente', 'inundação', 'vendaval', 
    'granizo', 'ciclone', 'onda de calor', 'chuva forte'
  ];
  const lowerTitle = title.toLowerCase();
  return alertKeywords.some(keyword => lowerTitle.includes(keyword));
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
    // 1. CACHE: Busca no banco
    const cacheTime = new Date(Date.now() - 4 * 60 * 60 * 1000);

    const localNews = await prisma.news.findMany({
      where: {
        city: city,
        createdAt: { gt: cacheTime }
      },
      orderBy: { pubDate: 'desc' },
      take: 5
    });

    if (localNews.length > 0) {
      console.log(`[CACHE] Retornando notícias locais para: ${city}`);
      return res.json(localNews);
    }

    // 2. API EXTERNA
    console.log(`[API] Buscando notícias de clima para: ${city}`);
    const apiKey = process.env.NEWS_API_KEY;
    const weatherKeywords = '(clima OR chuva OR temporal OR "previsão do tempo" OR meteorologia OR "defesa civil" OR alagamento OR "onda de calor")';
    const query = `${city} AND ${weatherKeywords}`;
    const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=${encodeURIComponent(query)}&country=br&language=pt`;

    const response = await axios.get(url);
    const apiResults = response.data.results;

    if (!apiResults || apiResults.length === 0) {
      return res.json([]); 
    }

    // 3. TRATAMENTO, SALVAMENTO E ALERTAS (ATUALIZADO)
    
    // Passso A: Buscar usuários dessa cidade para verificar quem precisa receber alerta
    const usersInCity = await prisma.user.findMany({
      where: { city: city },
      select: { id: true } // Só precisamos do ID
    });

    const newsToSave = [];

    for (const item of apiResults) {
      if (!item.link || !item.title) continue;

      // Monta o objeto da notícia
      newsToSave.push({
        city: city,
        title: item.title,
        link: item.link,
        description: item.description ? item.description.substring(0, 500) : "Ver notícia completa",
        imageUrl: item.image_url,
        source: item.source_id,
        pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
      });

      // --- LÓGICA DE SISTEMAS DISTRIBUÍDOS (NOVO) ---
      // Se for severo e tiver usuários na cidade, manda para o AlertService
      if (isSevere(item.title) && usersInCity.length > 0) {
        console.log(`[ALERTA] Notícia grave: "${item.title}". Enviando para AlertService...`);
        
        // Dispara o alerta para cada usuário (assíncrono para não travar o loop)
        usersInCity.forEach(async (user) => {
          try {
            await axios.post(`${ALERT_SERVICE_URL}/alerts`, {
              userId: user.id,
              city: city,
              message: `⚠️ ALERTA EM ${city.toUpperCase()}: ${item.title.substring(0, 100)}...`
            });
          } catch (err) {
            console.error(`[ERRO] Falha ao enviar para AlertService (User ${user.id}):`, err.message);
          }
        });
      }
    }

    // Passo B: Salvar as notícias no banco (News)
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