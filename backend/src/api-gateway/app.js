const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Configuração do CORS (O Gateway gerencia quem pode entrar)
app.use(cors());

// Rota de teste
app.get('/', (req, res) => {
  res.send('API Gateway is running!');
});

// --- ROTAS DE PROXY ---

// 1. Se o Front pedir /weather -> Redireciona para o container weather-service:3001
app.use('/weather', createProxyMiddleware({
  target: process.env.WEATHER_SERVICE_URL || 'http://weather-service:3001',
  changeOrigin: true,
  pathRewrite: {
    '^/weather': '', // Remove o /weather da URL antes de mandar para o serviço
  },
}));

// 2. Se pedir /news -> Redireciona para news-service:3002
// Nota: Removemos o pathRewrite aqui SE as rotas do seu serviço já esperarem /news
// Mas como no seu news-service a rota é /news/:city, se mandarmos /news/Recife,
// e o serviço espera /news/Recife, NÃO devemos remover o prefixo.
// Porém, se no serviço a rota fosse apenas /:city, teríamos que remover.
// Pelo seu código anterior: app.get('/news/:city'...) -> Então o serviço ESPERA receber /news.
app.use('/news', createProxyMiddleware({
  target: process.env.NEWS_SERVICE_URL || 'http://news-service:3002',
  changeOrigin: true,
  // Não usamos pathRewrite aqui porque seu serviço já tem rotas começando com /news
}));

// 3. Se pedir /users -> Redireciona para user-service:3003
app.use('/users', createProxyMiddleware({
  target: process.env.USER_SERVICE_URL || 'http://user-service:3003',
  changeOrigin: true,
}));

app.use('/notifications', createProxyMiddleware({
  target: process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:3005',
  changeOrigin: true,
  // Se a rota no serviço é /notifications/:userId, e aqui chamamos /notifications,
  // precisamos remover o prefixo SE o serviço esperasse apenas /:userId.
  // Mas como definimos app.get('/notifications/:userId'), NÃO precisa de rewrite.
}));

// 4. (Opcional) Se quiser expor o AlertService para testes (geralmente é interno)
app.use('/alerts', createProxyMiddleware({
  target: process.env.ALERT_SERVICE_URL || 'http://alert-service:3004',
  changeOrigin: true,
}));

app.listen(PORT, () => {
  console.log(`API Gateway rodando na porta ${PORT}`);
});