const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;


app.use(cors());

// test
app.get('/', (req, res) => {
  res.send('API Gateway is running!');
});



app.use('/weather', createProxyMiddleware({
  target: process.env.WEATHER_SERVICE_URL || 'http://weather-service:3001',
  changeOrigin: true,
  pathRewrite: {
    '^/weather': '', 
  },
}));

app.use('/news', createProxyMiddleware({
  target: process.env.NEWS_SERVICE_URL || 'http://news-service:3002',
  changeOrigin: true,
  
}));


app.use('/users', createProxyMiddleware({
  target: process.env.USER_SERVICE_URL || 'http://user-service:3003',
  changeOrigin: true,
  pathRewrite: {
    '^/users': '', 
  },
}));

app.use('/alerts', createProxyMiddleware({
  target: process.env.ALERT_SERVICE_URL || 'http://alert-service:3004',
  changeOrigin: true,
}));

app.listen(PORT, () => {
  console.log(`API Gateway rodando na porta ${PORT}`);
});