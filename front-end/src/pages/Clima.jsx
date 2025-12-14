import React, { useState, useEffect } from 'react';
import BarraLateral from '../components/BarraLateral';
import api from '../services/api'; // Sua instância do Axios configurada para port 4000

function Clima() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cidadeUser, setCidadeUser] = useState("");

  const [climaAtual, setClimaAtual] = useState({
    temperatura: 0,
    condicao: '--',
    umidade: 0,
    vento: 0
  });

  const [previsao, setPrevisao] = useState([]);

  // Função auxiliar para mapear descrições do tempo para Emojis
  const getIconByCondition = (condition) => {
    if (!condition) return '❓';
    const c = condition.toLowerCase();
    if (c.includes('limpo') || c.includes('sol') || c.includes('clear')) return '☀️';
    if (c.includes('nuvem') || c.includes('nublado') || c.includes('cloud')) return '☁️';
    if (c.includes('chuva') || c.includes('rain') || c.includes('drizzle')) return '🌧️';
    if (c.includes('tempestade') || c.includes('thunder')) return '⛈️';
    if (c.includes('neve') || c.includes('snow')) return '❄️';
    return '🌤️';
  };

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("userId");
      
      if (!userId) {
        setError("Usuário não identificado.");
        setLoading(false);
        return;
      }

      try {
        // 1. Busca dados do usuário para pegar a cidade
        // GET http://localhost:4000/users/{id}
        const userRes = await api.get(`/users/${userId}`);
        const city = userRes.data.city || "Recife"; // Fallback se não tiver cidade
        setCidadeUser(city);

        // 2. Busca dados do clima para essa cidade
        // GET http://localhost:4000/weather/{city}
        const weatherRes = await api.get(`/weather/weather/${city}`);
        const data = weatherRes.data;
        
        // Mapeia os dados da API para o estado (Ajuste conforme o retorno real do seu WeatherService)
        // Supondo que sua API retorna algo parecido com OpenWeatherMap:
        
        // Dados Atuais
        setClimaAtual({
 
            temperatura: Math.round(data.temp !== undefined ? data.temp : (data.main?.temp || 0)),
            
            // CORREÇÃO PRINCIPAL: Ler 'data.condition' que vem do backend
            condicao: data.condition || data.description || (data.weather ? data.weather[0].description : 'Indisponível'),
            
            // O backend manda 'humidity'
            umidade: data.humidity !== undefined ? data.humidity : (data.main?.humidity || 0),
            
            // O backend manda 'wind' (verifique se seu backend unificado manda 'wind' ou 'wind_speed')
            vento: data.wind !== undefined ? data.wind : (data.wind?.speed || 0)
          });

        // Previsão (Mockada ou Real dependendo se sua API retorna forecast)
        // Se sua API não retorna previsão de 5 dias, vamos gerar uma baseada na atual para não quebrar a tela
        if (data.forecast) {
           // Se sua API tiver forecast real, mapeie aqui
           setPrevisao(data.forecast);
        } else {
           // Fallback visual se a API só retornar clima atual
           const hoje = new Date();
           const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
           
           const previsaoMock = Array.from({ length: 5 }).map((_, i) => {
             const dataFutura = new Date();
             dataFutura.setDate(hoje.getDate() + i);
             return {
               id: i,
               dia: i === 0 ? 'Hoje' : diasSemana[dataFutura.getDay()],
               temp: Math.round((data.temp || 25) + (Math.random() * 4 - 2)), // Variação leve
               icon: getIconByCondition(data.description || 'sol')
             };
           });
           setPrevisao(previsaoMock);
        }

        setLoading(false);

      } catch (err) {
        console.error("Erro ao buscar clima:", err);
        setError("Não foi possível carregar os dados meteorológicos.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="h-screen text-gray-800 flex min-w-[1024px]">
      <BarraLateral />

      <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
        
        {/* Cabeçalho com Nome da Cidade */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">
            Clima em <span className="text-blue-600 capitalize">{cidadeUser}</span>
          </h1>
          {loading && <span className="text-blue-500 animate-pulse">Atualizando...</span>}
        </div>

        {error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
            <p>{error}</p>
          </div>
        ) : (
          <>
            {/* Clima Atual */}
            <section className="mb-12">
              <div className="bg-white rounded-xl shadow p-6 border-t-4 border-blue-500">
                <h2 className="text-xl font-semibold text-blue-500 mb-6">
                  🌡️ Condições Atuais
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  {/* Esquerda: Temperatura e Ícone */}
                  <div className="flex items-center gap-6">
                    <span className="text-8xl">{getIconByCondition(climaAtual.condicao)}</span>
                    <div>
                      <span className="text-6xl font-bold text-gray-800">
                        {climaAtual.temperatura}°
                      </span>
                      <p className="text-xl text-gray-500 capitalize mt-2">
                        {climaAtual.condicao}
                      </p>
                    </div>
                  </div>

                  {/* Direita: Detalhes */}
                  <div className="space-y-4 text-lg text-gray-600 bg-gray-50 p-6 rounded-lg">
                    <div className="flex justify-between border-b pb-2">
                      <span>💧 Umidade</span>
                      <span className="font-bold text-blue-600">{climaAtual.umidade}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>🌬️ Vento</span>
                      <span className="font-bold text-blue-600">{climaAtual.vento} km/h</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Previsão */}
            <section>
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold text-blue-500 mb-6">
                  📅 Previsão (Próximos dias)
                </h2>

                <div className="flex gap-4 overflow-x-auto pb-4">
                  {previsao.map(dia => (
                    <div
                      key={dia.id}
                      className="min-w-[160px] bg-blue-50 hover:bg-blue-100 transition rounded-xl p-4 flex flex-col items-center gap-3 border border-blue-100"
                    >
                      <span className="text-4xl">{dia.icon}</span>
                      <div className="text-center">
                        <p className="font-bold text-gray-700">{dia.dia}</p>
                        <p className="text-lg text-blue-600 font-bold">{dia.temp}°C</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default Clima;