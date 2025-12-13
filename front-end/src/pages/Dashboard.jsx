import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BarraLateral from '../components/BarraLateral';

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="h-screen text-gray-800 flex flex-col min-w-[1024px]">
      <div className="flex flex-1 overflow-hidden">
        <BarraLateral />

        {/* Área central */}
        <main className="flex-1 overflow-y-auto p-8 bg-white">
          <h1 className="text-4xl font-bold mb-6">Dashboard</h1> {/* Adicionar Cidade */}
          {/* Resumo do Clima */}
          <section className="mb-16">
            <h2 className="text-lg font-semibold mb-8 flex items-center gap-2">
              Resumo do Clima
            </h2>
          </section>
          {/* Últimas Notícias */}
          <section className="mb-16">
            <h2 className="text-lg font-semibold mb-8 flex items-center gap-2">
              Últimas Notícias
            </h2>
          </section>
          {/* Alertas Recentes */}
          <section className="mb-16">
            <h2 className="text-lg font-semibold mb-8 flex items-center gap-2">
             Alertas Recentes
            </h2>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;