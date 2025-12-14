import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BarraLateral from '../components/BarraLateral';

function Dashboard() {
  const [clima, setClima] = useState(null);
  const [noticias, setNoticias] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);

  const cidade = 'Recife';
  const userId = 1;

  useEffect(() => {
    async function carregarDados() {
      try {
        // SOLUÇÃO DO CORS: Bater tudo na porta 4000 (API Gateway)
        const [resClima, resNoticias, resAlertas] = await Promise.all([
          axios.get(`http://localhost:4000/weather/weather/${cidade}`),
          axios.get(`http://localhost:4000/news/${cidade}`),
          axios.get(`http://localhost:4000/alerts/${userId}`)
        ]);

        setClima(resClima.data);
        setNoticias(resNoticias.data.slice(0, 3));
        setAlertas(resAlertas.data.slice(0, 3));

      } catch (error) {
        console.error("Erro ao carregar dados do dashboard", error);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex min-w-[1024px]">
        <BarraLateral />
        <main className="flex-1 p-8 bg-gray-50 flex items-center justify-center">
          <p className="text-xl text-gray-500">Carregando informações...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen flex min-w-[1024px]">
      <BarraLateral />

      <main className="flex-1 p-8 bg-gray-50 overflow-y-auto">
        <h1 className="text-4xl font-bold mb-10">Dashboard</h1>

        <section className="mb-12">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-blue-500 mb-4">
              Resumo do Clima
            </h2>

            <div className="flex gap-6">
              <div className="bg-blue-50 rounded-lg p-4 flex-1">
                🌡️ Temperatura: {clima ? `${clima.temp}°C` : '--'}
              </div>

              <div className="bg-blue-50 rounded-lg p-4 flex-1 capitalize">
                {/* Ajustei de .description para .condition conforme seu backend */}
                ☀️ Condição: {clima ? clima.condition : '--'}
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-blue-500 mb-4">
              Últimas Notícias
            </h2>

            <div className="space-y-3">
              {noticias.length === 0 ? (
                <p className="text-gray-400 italic">Nenhuma notícia recente.</p>
              ) : (
                noticias.map(noticia => (
                  <div
                    key={noticia.id}
                    className="bg-blue-50 rounded-lg px-4 py-3"
                  >
                    📰 {noticia.title}
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="mb-12">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-blue-500 mb-4">
              Alertas Recentes
            </h2>

            <div className="space-y-3">
              {alertas.length === 0 ? (
                <p className="text-gray-400 italic">Nenhum alerta ativo.</p>
              ) : (
                alertas.map(alerta => (
                  <div
                    key={alerta.id}
                    className="bg-red-50 border border-red-300 rounded-lg px-4 py-3 text-red-800"
                  >
                    ⚠️ {alerta.message}
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;