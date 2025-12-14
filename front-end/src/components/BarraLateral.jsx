// Removi o import do LoginPage pois não é usado aqui
import { useNavigate } from 'react-router-dom';

function BarraLateral() {
  const navigate = useNavigate();
  
  // Pegamos o ID aqui para facilitar a leitura no JSX
  const userId = localStorage.getItem("userId");

  // Função para limpar dados ao sair
  const handleLogout = () => {
    localStorage.clear(); // Limpa token, id, dados do usuário
    navigate("/login");
  };

  return (
    <div className="inline-block align-top w-60 h-full border-r border-gray-200 bg-[#4A90E2] p-6 min-h-screen">
      <div className="space-y-6 pl-3">
        
        <h1 className="font-bold text-3xl text-white">
          Clima<span className="text-orange-300">360</span>
        </h1>

        {/* Dashboard (Mantém o ID pois sua rota pede) */}
        <button onClick={() => navigate(`/dashboard/${userId}`)}
          className="mt-10 flex items-center space-x-2 text-white hover:text-[#1A225F] hover:cursor-pointer transition duration-200 w-full text-left">
          <span className="text-3xl">📊</span>
          <span className="font-bold ml-2">Dashboard</span>
        </button>

        {/* Clima */}
        <button onClick={() => navigate(`/clima/${userId}`)}
          className="mt-8 flex items-center space-x-2 text-white hover:text-[#1A225F] hover:cursor-pointer transition duration-200 w-full text-left">
          <span className="text-3xl">⛅</span>
          <span className="font-bold ml-2">Clima</span>
        </button>

        {/* Notícias */}
        <button onClick={() => navigate(`/noticias/${userId}`)}
          className="mt-8 flex items-center space-x-2 text-white hover:text-[#1A225F] hover:cursor-pointer transition duration-200 w-full text-left">
          <span className="text-3xl">📰</span>
          <span className="font-bold ml-2">Notícias</span>
        </button>

        {/* Alertas */}
        <button onClick={() => navigate(`/alertas/${userId}`)}
          className="mt-8 flex items-center space-x-2 text-white hover:text-[#1A225F] hover:cursor-pointer transition duration-200 w-full text-left">
          <span className="text-3xl">⚠️</span>
          <span className="font-bold ml-2">Alertas</span>
        </button>

        {/* --- CORREÇÃO AQUI --- */}
        {/* Perfil: Sem ID na URL, pois o componente Perfil lê do localStorage */}
        <button onClick={() => navigate("/perfil")}
          className="mt-8 flex items-center space-x-2 text-white hover:text-[#1A225F] hover:cursor-pointer transition duration-200 w-full text-left">
          <span className="text-3xl">👤</span>
          <span className="font-bold ml-2">Perfil</span>
        </button>

        {/* --- CORREÇÃO AQUI --- */}
        {/* Sair: Chama a função que limpa os dados */}
        <button onClick={handleLogout}
          className="mt-8 flex items-center space-x-2 text-white hover:text-[#1A225F] hover:cursor-pointer transition duration-200 w-full text-left">
          <span className="text-3xl">⬅️</span>
          <span className="font-bold ml-2">Sair</span>
        </button>

      </div>
    </div>
  )
}

export default BarraLateral;