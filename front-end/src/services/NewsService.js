import api from "./api";

export const getNewsByCity = async (city) => {
  // O Gateway redireciona /news -> news-service
  // A rota final no serviço é /news/:city
  // Então a URL completa fica: http://localhost:4000/news/news/Recife
  // (Ficou "news/news" porque o Gateway tem prefixo /news e o serviço também)
  const response = await api.get(`/news/news/${city}`);
  return response.data;
};