import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Não esqueça de ter o axios instalado
import BarraLateral from '../components/BarraLateral';

function Alertas() {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);

  // ID do usuário logado (Fixado em 1 para testes, depois virá do Login)
  const userId = 1; 

  useEffect(() => {
    async function fetchAlertas() {
      try {
        // Conecta na porta 3004 (AlertService)
        const response = await axios.get(`http://localhost:3004/alerts/${userId}`);
        setAlertas(response.data);
      } catch (error) {
        console.error("Erro ao buscar alertas:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAlertas();
  }, [userId]);

  return (
    <div className="h-screen text-gray-800 flex min-w-[1024px]">
      <BarraLateral />

      <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
        <h1 className="text-4xl font-bold mb-10">Meus Alertas</h1>

        <section>
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-blue-500 mb-6">
              Alertas Recentes
            </h2>

            {loading ? (
              <p className="text-gray-500">Carregando alertas...</p>
            ) : alertas.length === 0 ? (
              <p className="text-gray-400 italic">Nenhum alerta para sua região no momento.</p>
            ) : (
              <div className="space-y-4">
                {alertas.map((alerta) => (
                  <div
                    key={alerta.id}
                    className="bg-red-50 border-l-4 border-red-500 rounded-r-lg px-4 py-3 flex flex-col gap-1"
                  >
                    <div className="flex items-center gap-2 font-bold text-red-700">
                      ⚠️ <span>Alerta em {alerta.city}</span>
                    </div>
                    <span className="text-gray-700 text-sm">
                      {alerta.message}
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      {new Date(alerta.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Alertas;