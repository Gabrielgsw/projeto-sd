import React, { useState } from 'react';
import BarraLateral from '../components/BarraLateral';

function Clima() {

  const [climaAtual, setClimaAtual] = useState({
    temperatura: 27,
    condicao: 'Ensolarado',
    umidade: 58,
    vento: 12
  });

  const [previsao, setPrevisao] = useState([
    { id: 1, dia: 'Hoje', temp: 27, icon: '🌤️' },
    { id: 2, dia: 'Amanhã', temp: 30, icon: '☀️' },
    { id: 3, dia: 'Quarta', temp: 29, icon: '🌥️' },
    { id: 4, dia: 'Quinta', temp: 23, icon: '🌧️' },
    { id: 5, dia: 'Sexta', temp: 21, icon: '⛈️' }
  ]);

  return (
    <div className="h-screen text-gray-800 flex min-w-[1024px]">
      <BarraLateral />

      <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
        <h1 className="text-4xl font-bold mb-10">Clima</h1>

        {/* Clima Atual */}
        <section className="mb-12">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-blue-500 mb-6">
              Clima Atual
            </h2>

            <div className="space-y-3 text-gray-700">
              <p>
                <span className="font-semibold">
                  {climaAtual.temperatura}°C
                </span>{' '}
                — {climaAtual.condicao}
              </p>

              <p>💧 Umidade: {climaAtual.umidade}%</p>
              <p>🌬️ Vento: {climaAtual.vento} km/h</p>
            </div>
          </div>
        </section>

        {/* Previsão */}
        <section>
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-blue-500 mb-6">
              Previsão
            </h2>

            <div className="flex gap-4 overflow-x-auto">
              {previsao.map(dia => (
                <div
                  key={dia.id}
                  className="min-w-[180px] bg-blue-50 rounded-xl p-4 flex items-center gap-3"
                >
                  <span className="text-2xl">{dia.icon}</span>
                  <div>
                    <p className="font-semibold">{dia.dia}</p>
                    <p className="text-sm text-gray-600">{dia.temp}°C</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

export default Clima;
