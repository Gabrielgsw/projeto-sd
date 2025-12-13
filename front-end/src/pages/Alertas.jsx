import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BarraLateral from '../components/BarraLateral';

function Alertas() {
  const navigate = useNavigate();

  return (
    <div className="h-screen text-gray-800 flex flex-col min-w-[1024px]">
      <div className="flex flex-1 overflow-hidden">
        <BarraLateral />

        {/* Área central */}
        <main className="flex-1 overflow-y-auto p-8 bg-white">
          <h1 className="text-4xl font-bold mb-6">Alertas</h1>

          {/* Alertas*/}
          <section className="mb-16">
            <h2 className="text-lg font-semibold mb-8 flex items-center gap-2">
              Alertas do Sistema
            </h2>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Alertas;