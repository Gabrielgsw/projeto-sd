import express from "express";
import axios from "axios";
import { weatherStore } from "./weatherData.js";

const app = express();
app.use(express.json());

const API_KEY = "a650ec49e0e1970ee74f8f0898ec99a4";

// ------------------------------
// 1) Clima atual
// ------------------------------
app.get("/weather/current/:city", async (req, res) => {
  const { city } = req.params;

  // já existe em memória?
  if (weatherStore.current[city]) {
    return res.json({ source: "memory", data: weatherStore.current[city] });
  }

  // buscar na OpenWeather
  const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
  );

  const data = {
    temp: response.data.main.temp,
    condition: response.data.weather[0].description,
  };

  weatherStore.current[city] = data;

  return res.json({ source: "api", data });
});

// ------------------------------
// 2) Umidade
// ------------------------------
app.get("/weather/humidity/:city", async (req, res) => {
  const { city } = req.params;

  if (weatherStore.humidity[city]) {
    return res.json({ source: "memory", data: weatherStore.humidity[city] });
  }

  const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
  );

  const data = { humidity: response.data.main.humidity };

  weatherStore.humidity[city] = data;

  return res.json({ source: "api", data });
});

// ------------------------------
// 3) Vento
// ------------------------------
app.get("/weather/wind/:city", async (req, res) => {
  const { city } = req.params;

  if (weatherStore.wind[city]) {
    return res.json({ source: "memory", data: weatherStore.wind[city] });
  }

  const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
  );

  const data = { speed: response.data.wind.speed };

  weatherStore.wind[city] = data;

  return res.json({ source: "api", data });
});

// ------------------------------
// 4) Previsão
// ------------------------------
app.get("/weather/forecast/:city", async (req, res) => {
  const { city } = req.params;

  if (weatherStore.forecast[city]) {
    return res.json({ source: "memory", data: weatherStore.forecast[city] });
  }

  const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
  );

  const data = response.data.list.slice(0, 5);

  weatherStore.forecast[city] = data;

  return res.json({ source: "api", data });
});

app.listen(3001, () => {
  console.log("Weather Service rodando na porta 3001 🚀");
});
