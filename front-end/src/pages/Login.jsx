import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Certifique-se que o caminho está certo
import { jwtDecode } from 'jwt-decode';
import LadoLogoPage from '../components/LadoLogoPage.jsx';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Insira um e-mail válido.");
      setLoading(false);
      return;
    }

    try {
      // --- INTEGRAÇÃO COM GATEWAY ---
      // POST http://localhost:4000/users/login
      const response = await api.post('/users/login', {
        email: email,
        password: password,
      });

      const { access, refresh } = response.data;
      
      // Decodifica o token para pegar o ID (conforme lógica original)
      const decoded = jwtDecode(access);
      const userId = decoded.user_id;

      if (!userId) {
        console.error("user_id não encontrado no token JWT!");
        setError("Erro ao processar login. Tente novamente.");
        setLoading(false);
        return;
      }

      // Salva no LocalStorage
      localStorage.setItem('accessToken', access);
      if(refresh) localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('userId', userId);

      console.log(`Login com sucesso! ID: ${userId}`);

      // Redireciona para o Dashboard
      navigate(`/dashboard/${userId}`);

    } catch (err) {
      console.error('Falha no login:', err);
      setLoading(false);
      
      if (err.response?.status === 401) {
        setError('E-mail ou senha incorretos.');
      } else {
        setError('Erro ao conectar ao servidor.');
      }
    }
  };

  return (
    <div className="h-screen flex text-gray-800 bg-[#1A225F] overflow-hidden">
      <div className="w-1/2 h-screen hidden md:block">
        <LadoLogoPage />
      </div>

      {/* Formulário */}
      <div className="w-full md:w-1/2 h-screen bg-white flex flex-col justify-center items-center p-8 md:p-12">
        <div className="w-full max-w-sm">

          <h1 className="text-4xl font-bold mb-4 text-gray-800">
            Entrar na sua conta
          </h1>

          {error &&
            <p className="bg-red-100 text-red-700 text-center p-3 rounded-md mb-4 whitespace-pre-line border border-red-400">
              {error}
            </p>}

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-bold mb-2 text-gray-800 text-[20px]"
              >
                E-mail
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="Digite seu e-mail"
                className="shadow-sm w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-bold mb-2 text-gray-800 text-[20px]"
              >
                Senha
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Digite sua senha"
                className="shadow-sm w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`shadow-lg w-full bg-[#4858FF] md:bg-main text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 active:opacity-80 transition duration-300 cursor-pointer ${loading ? 'opacity-70 cursor-wait' : ''}`}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>

            <p className="mt-6 text-gray-700 mb-8 text-center">
              Não tem uma conta?{' '}
              <a href="/cadastro" className="text-[#1A225F] md:text-main font-bold hover:underline">
                Cadastre-se
              </a>
            </p>
          </form>

        </div>
      </div>
    </div>
  );
}

export default Login;