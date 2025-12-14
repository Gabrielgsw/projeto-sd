import React, { useState, useEffect } from 'react';
import BarraLateral from '../components/BarraLateral';
import api from '../services/api'; // Importa o axios configurado no Gateway

function Noticias() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cidade, setCidade] = useState("");

  useEffect(() => {
    const fetchNoticias = async () => {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        setError("Usuário não logado.");
        setLoading(false);
        return;
      }

      try {
        // 1. Busca dados do usuário para pegar a cidade
        // GET http://localhost:4000/users/{id}
        const userRes = await api.get(`/users/${userId}`);
        const userCity = userRes.data.city || "Recife"; // Cidade padrão caso vazia
        setCidade(userCity);

        // 2. Busca notícias dessa cidade
        // GET http://localhost:4000/news/{cidade}
        // O Gateway redireciona para o NewsService
        const newsRes = await api.get(`/news/${userCity}`);
        
        // Verifica se veio um array
        if (Array.isArray(newsRes.data)) {
          setNoticias(newsRes.data);
        } else {
          setNoticias([]);
        }
        
      } catch (err) {
        console.error("Erro ao carregar notícias:", err);
        setError("Não foi possível carregar as notícias no momento.");
      } finally {
        setLoading(false);
      }
    };

    fetchNoticias();
  }, []);

  // Função para formatar a data (ex: 13/12/2025)
  const formatarData = (dataIso) => {
    if (!dataIso) return "";
    return new Date(dataIso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="h-screen text-gray-800 flex min-w-[1024px]">
      <BarraLateral />

      <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
        
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">
            Notícias 
          </h1>
          {cidade && (
            <span className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full font-semibold">
              📍 {cidade}
            </span>
          )}
        </div>

        {/* Loading e Erros */}
        {loading && <p className="text-gray-500 animate-pulse">Buscando as últimas notícias...</p>}
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            {error}
          </div>
        )}

        {/* Lista de Notícias */}
        {!loading && !error && noticias.length === 0 && (
          <div className="bg-yellow-50 p-4 rounded text-yellow-800">
            Nenhuma notícia recente encontrada sobre clima para esta região.
          </div>
        )}

        <section className="space-y-6">
          {noticias.map((noticia, index) => (
            <div 
              key={index} // Usamos index pois nem sempre a API externa garante ID único
              className="bg-white rounded-xl shadow hover:shadow-lg transition duration-200 overflow-hidden border border-gray-100"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {noticia.source || "Fonte Desconhecida"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatarData(noticia.pubDate)}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  <a 
                    href={noticia.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 transition"
                  >
                    {noticia.title}
                  </a>
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {noticia.description}
                </p>

                <a 
                  href={noticia.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 font-semibold hover:underline"
                >
                  Ler matéria completa 
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </a>
              </div>
            </div>
          ))}
        </section>

      </main>
    </div>
  );
}

export default Noticias;