import React, { useState } from 'react';
import BarraLateral from '../components/BarraLateral';

function Alertas() {

  const [alertas, setAlertas] = useState([
    {
      id: 1,
      mensagem: 'Alerta de calor extremo — índice UV alto',
      tipo: 'calor'
    },
    {
      id: 2,
      mensagem: 'Risco de tempestade nas próximas 24h',
      tipo: 'tempestade'
    },
    {
      id: 3,
      mensagem: 'Nível de água elevado em áreas costeiras',
      tipo: 'enchente'
    }
  ]);

  return (
    <div className="h-screen text-gray-800 flex min-w-[1024px]">
      <BarraLateral />

      <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
        <h1 className="text-4xl font-bold mb-10">Alertas</h1>

        {/* Alertas do Sistema */}
        <section>
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-blue-500 mb-6">
              Alertas do Sistema
            </h2>

            <div className="space-y-4">
              {alertas.map(alerta => (
                <div
                  key={alerta.id}
                  className="bg-blue-50 rounded-lg px-4 py-3 flex items-center gap-3"
                >
                  ⚠️
                  <span className="text-gray-700">
                    {alerta.mensagem}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Alertas;
