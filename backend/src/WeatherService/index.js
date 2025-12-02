import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();


const app = express();
app.use(express.json());

const apiKEY = process.env.API_KEY_WEATHER;


app.get('/weather/city/:cityName', async (req, res) => {
    const cityName = req.params.cityName;
    const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKEY}`);
    res.json(response.data);
    console.log(response.data);

});




