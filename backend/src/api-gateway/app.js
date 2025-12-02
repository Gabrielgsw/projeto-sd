import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

const WEATHER_SERVICE_URL = "http://localhost:3001";

// clima atual
app.get("/api/weather/current/:city", async (req, res) => {
  const { city } = req.params;

  try {
    const response = await axios.get(
      `${WEATHER_SERVICE_URL}/weather/current/${city}`
    );

    res.json(response.data);
  } catch (err) {
    console.error("Erro ao chamar Weather Service:", err.message);
    res.status(500).json({ error: "Weather Service indisponível" });
  }
});

// umidade atual
app.get("/api/weather/humidity/:city", async (req, res) => {
  const { city } = req.params;

  try {
    const response = await axios.get(
      `${WEATHER_SERVICE_URL}/weather/humidity/${city}`
    );
    res.json(response.data);
    } catch (err) {
    console.error("Erro ao chamar Weather Service:", err.message);
    res.status(500).json({ error: "Weather Service indisponível" });
  }
});

//previsão

app.get("/api/weather/forecast/:city", async (req, res) => {
  const { city } = req.params;

  try {
    const response = await axios.get(
      `${WEATHER_SERVICE_URL}/weather/forecast/${city}`
    );
    res.json(response.data);
    } catch (err) {
    console.error("Erro ao chamar Weather Service:", err.message);
    res.status(500).json({ error: "Weather Service indisponível" });
  }
});

app.listen(3000, () => {
  console.log("API Gateway rodando na porta 3000");
});
