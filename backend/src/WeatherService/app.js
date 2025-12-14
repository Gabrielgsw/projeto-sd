import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { createClient } from "redis";

dotenv.config();

const app = express();
app.use(express.json());

const prisma = new PrismaClient();

// Configuração do Redis 
const redis = createClient({
  url: process.env.REDIS_URL || 'redis://redis:6379'
});

redis.on('error', (err) => console.log('Redis Client Error', err));

// Conexão Redis 
(async () => {
  await redis.connect();
  console.log("Conectado ao Redis");
})();

const API_KEY = process.env.OPENWEATHER_API_KEY;
const ALERT_SERVICE_URL = process.env.ALERT_SERVICE_URL || 'http://alert-service:3004';

// Função para checar risco climático
function checkWeatherRisk(data, city) {
  
  const isHighWind = data.wind >= 50; 
  const isStorm = data.condition.toLowerCase().includes('tempestade') || 
                  data.condition.toLowerCase().includes('chuva'); 

  if (isHighWind || isStorm) {
    console.log(`[CLIMA] ⛈️ Perigo detectado em ${city}! Enviando solicitação de alerta...`);    
    
    
    axios.post(`${ALERT_SERVICE_URL}/alerts`, {
        userId: 1, 
        city: city,
        message: `⚠️ ALERTA METEOROLÓGICO em ${city}: ${data.condition}, Ventos de ${data.wind}km/h.`
    }).catch(e => console.error(`Erro ao contatar AlertService: ${e.message}`));
  }
}

// obter informações climáticas por cidade
app.get("/weather/:city", async (req, res) => { 
  try {
    const { city } = req.params;
    const cacheKey = `weather:full:${city}`;

    // le o cache no Redis
    try {
        const cached = await redis.get(cacheKey);
        if (cached) {
            console.log(`[CACHE] Clima recuperado do Redis para ${city}`);
            return res.json({ source: "cache", ...JSON.parse(cached) });
        }
    } catch (e) {
        console.error("Erro ao ler Redis (ignorando):", e.message);
    }

    
    console.log(`[API] Buscando na OpenWeather para: ${city}`);
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=pt_br`
    );

    
    const weatherData = {
      city: city,
      temp: response.data.main.temp,
      humidity: response.data.main.humidity,
      wind: response.data.wind.speed,
      condition: response.data.weather[0].description,
      updatedAt: new Date()
    };

    // salva no cache do Redis por 10 minutos
    await redis.setEx(cacheKey, 600, JSON.stringify(weatherData));

    // salva no db
    try {
        await prisma.weather.create({
        data: {
            city: city,
            temp: weatherData.temp,
            condition: weatherData.condition,            
        },
        });
        console.log(`[DB] Clima salvo no Postgres.`);
    } catch (dbError) {
        console.error(`[DB ERRO] Tabela Weather não encontrada ou schema inválido: ${dbError.message}`);
    }
   
    checkWeatherRisk(weatherData, city);

    return res.json({ source: "api", ...weatherData });

  } catch (error) {
    console.error("Erro geral:", error.message);    
    return res.status(500).json({ error: "Erro ao buscar clima" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Weather Service rodando na porta ${PORT} 🚀`);
});