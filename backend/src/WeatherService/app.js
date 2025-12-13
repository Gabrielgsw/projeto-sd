import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { createClient } from "redis";

dotenv.config();

const app = express();
app.use(express.json());

const prisma = new PrismaClient();
const redis = createClient({
  url: process.env.REDIS_URL || 'redis://redis:6379'
});

await redis.connect();

const API_KEY = process.env.OPENWEATHER_API_KEY;

// ------------------------------
// 1) Clima atual
// ------------------------------
app.get("/weather/current/:city", async (req, res) => {
  try {
    const { city } = req.params;
    const cacheKey = `weather:current:${city}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json({ source: "cache", data: JSON.parse(cached) });
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    const data = {
      temp: response.data.main.temp,
      condition: response.data.weather[0].description,
    };

    await redis.setEx(cacheKey, 600, JSON.stringify(data));

    await prisma.weather.create({
      data: {
        city,
        temp: data.temp,
        condition: data.condition
      },
    });

    return res.json({ source: "api", data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ------------------------------
// 2) Umidade
// ------------------------------
app.get("/weather/humidity/:city", async (req, res) => {
  try {
    const { city } = req.params;
    const cacheKey = `weather:humidity:${city}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json({ source: "cache", data: JSON.parse(cached) });
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    const data = { humidity: response.data.main.humidity };

    await redis.setEx(cacheKey, 600, JSON.stringify(data));

    await prisma.weather.create({
      data: {
        city,
        humidity: data.humidity
      },
    });

    return res.json({ source: "api", data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ------------------------------
// 3) Vento
// ------------------------------
app.get("/weather/wind/:city", async (req, res) => {
  try {
    const { city } = req.params;
    const cacheKey = `weather:wind:${city}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json({ source: "cache", data: JSON.parse(cached) });
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    const data = { speed: response.data.wind.speed };

    await redis.setEx(cacheKey, 600, JSON.stringify(data));

    await prisma.weather.create({
      data: {
        city,
        wind: data.speed
      },
    });

    return res.json({ source: "api", data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ------------------------------
// 4) Previsão
// ------------------------------
app.get("/weather/forecast/:city", async (req, res) => {
  try {
    const { city } = req.params;
    const cacheKey = `weather:forecast:${city}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json({ source: "cache", data: JSON.parse(cached) });
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );

    const data = response.data.list.slice(0, 5);

    await redis.setEx(cacheKey, 600, JSON.stringify(data));

    return res.json({ source: "api", data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Weather Service rodando na porta ${PORT} 🚀`);
});