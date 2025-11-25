import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3000;


const apiKEY = process.env.API_KEY_WEATHER;
console.log("API Key:", apiKEY);


app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Rota /weather/city
app.get("/weather/city", async (req, res) => {
  try {
    console.log("Chegou na rota /weather/city");

    const city = req.query.city; // exemplo: /weather/city?city=Recife

    if (!city) {
      return res.status(400).json({ error: "Parâmetro 'city' é obrigatório" });
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKEY}&units=metric&lang=pt_br`;

    const response = await axios.get(url);

    console.log(response.data);
    res.json(response.data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao consultar a Weather API" });
  }
});

app.listen(port, () => {
  console.log(`Server rodando na porta ${port}`);
});
