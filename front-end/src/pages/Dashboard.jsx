import React, { useState } from 'react';
import BarraLateral from '../components/BarraLateral';

function Dashboard() {

  const [clima, setClima] = useState({
    temperatura: 27,
    condicao: 'Ensolarado'
  });

  const [noticias, setNoticias] = useState([
    { id: 1, texto: 'Onda de calor atinge região Sul do país.' },
    { id: 2, texto: 'Chuvas fortes previstas para esta semana.' }
  ]);

  const [alertas, setAlertas] = useState([
    { id: 1, tipo: 'calor', mensagem: 'Alerta de calor extremo — risco moderado.' }
  ]);

  return (
    <div className="h-screen flex min-w-[1024px]">
      <BarraLateral />

      <main className="flex-1 p-8 bg-gray-50 overflow-y-auto">
        <h1 className="text-4xl font-bold mb-10">Dashboard</h1>

        {/* Resumo do Clima */}
        <section className="mb-12">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-blue-500 mb-4">
              Resumo do Clima
            </h2>

            <div className="flex gap-6">
              <div className="bg-blue-50 rounded-lg p-4 flex-1">
                🌡️ Temperatura: {clima.temperatura}°C
              </div>

              <div className="bg-blue-50 rounded-lg p-4 flex-1">
                ☀️ Condição: {clima.condicao}
              </div>
            </div>
          </div>
        </section>

        {/* Últimas Notícias */}
        <section className="mb-12">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-blue-500 mb-4">
              Últimas Notícias
            </h2>

            <div className="space-y-3">
              {noticias.map(noticia => (
                <div
                  key={noticia.id}
                  className="bg-blue-50 rounded-lg px-4 py-3"
                >
                  📰 {noticia.texto}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Alertas Recentes */}
        <section className="mb-12">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-blue-500 mb-4">
              Alertas Recentes
            </h2>

            <div className="space-y-3">
              {alertas.map(alerta => (
                <div
                  key={alerta.id}
                  className="bg-yellow-50 border border-yellow-300 rounded-lg px-4 py-3 text-yellow-800"
                >
                  ⚠️ {alerta.mensagem}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
