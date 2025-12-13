import LoginPage from "../pages/Login";
import { useNavigate } from 'react-router-dom';

function BarraLateral() {
  const navigate = useNavigate();
    return (
      <div className="inline-block align-top w-60 h-full border-r border-gray-200 bg-[#4A90E2] p-6">
        <div className="space-y-6 pl-3">
          {/*criar as rotas de navegacao */}
          <h1 className="font-bold text-6x1 text-white">
            Clima<span className="text-orange-300">360</span>
          </h1>

          <button onClick={() => navigate("/dashboard")}
            className="mt-10 flex items-center space-x-2 text-white hover:text-[#1A225F] hover:cursor-pointer transition duration-200">
            <span className="text-3xl">📊</span>
            <span className="font-bold ml-2">Dashboard</span>
          </button>

          <button onClick={() => navigate("/clima")}
            className="mt-8 flex items-center space-x-2 text-white hover:text-[#1A225F] hover:cursor-pointer transition duration-200">
            <span className="text-3xl">⛅</span>
            <span className="font-bold ml-2">Clima</span>
          </button>

          <button onClick={() => navigate("/noticias")}
            className="mt-8 flex items-center space-x-2 text-white hover:text-[#1A225F] hover:cursor-pointer transition duration-200">
            <span className="text-3xl">📰</span>
            <span className="font-bold ml-2">Notícias</span>
          </button>

          <button onClick={() => navigate("/alertas")}
            className="mt-8 flex items-center space-x-2 text-white hover:text-[#1A225F] hover:cursor-pointer transition duration-200">
            <span className="text-3xl">⚠️</span>
            <span className="font-bold ml-2">Alertas</span>
          </button>

          <button onClick={() => navigate("/perfil")} // ID?
            className="mt-8 flex items-center space-x-2 text-white hover:text-[#1A225F] hover:cursor-pointer transition duration-200">
            <span className="text-3xl">👤</span>
            <span className="font-bold ml-2">Perfil</span>
          </button>

          <button onClick={() => navigate("/login")} // ID?
            className="mt-8 flex items-center space-x-2 text-white hover:text-[#1A225F] hover:cursor-pointer transition duration-200">
            <span className="text-3xl">⬅️</span>
            <span className="font-bold ml-2">Sair</span>
          </button>
        </div>
      </div>
    )
}

export default BarraLateral;