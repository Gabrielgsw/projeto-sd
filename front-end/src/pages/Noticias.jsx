import React, { useState } from 'react';
import BarraLateral from '../components/BarraLateral';

function Noticias() {

  const [noticias, setNoticias] = useState([
    { id: 1, titulo: 'Temperaturas globais subiram 1.2°C em 2024' },
    { id: 2, titulo: 'Regiões costeiras enfrentam risco de enchentes' },
    { id: 3, titulo: 'Nova frente fria chega ao Sudeste' },
    { id: 4, titulo: 'Seca prolongada ameaça lavouras no Centro-Oeste' }
  ]);

  return (
    <div className="h-screen text-gray-800 flex min-w-[1024px]">
      <BarraLateral />

      <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
        <h1 className="text-4xl font-bold mb-10">Notícias</h1>

        {/* Notícias Climáticas */}
        <section>
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-blue-500 mb-6">
              Notícias Climáticas
            </h2>

            <div className="space-y-4">
              {noticias.map(noticia => (
                <div
                  key={noticia.id}
                  className="bg-blue-50 rounded-lg px-4 py-3 flex items-center gap-3"
                >
                  📰
                  <span className="text-gray-700">
                    “{noticia.titulo}”
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

export default Noticias;
