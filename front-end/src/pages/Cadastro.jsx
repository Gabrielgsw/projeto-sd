import React, { useState } from "react";
import LadoLogoPage from "../components/LadoLogoPage";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; // Certifique-se que este arquivo aponta para http://localhost:4000

function Cadastro() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Novo estado para feedback

  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // Bloqueia o botão

    // --- VALIDAÇÕES ---
    if (!name.trim()) {
        setError("O nome é obrigatório.");
        setLoading(false);
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Insira um e-mail válido.");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      setLoading(false);
      return;
    }

    try {
      // --- A MUDANÇA PRINCIPAL ESTÁ AQUI ---
      // O Gateway (porta 4000) redireciona /users para o user-service
      const response = await api.post("/users/register", {
        email: email,
        password: password,
        name: name
      });

      console.log("Sucesso:", response.data);
      alert("Conta criada com sucesso!");
      navigate("/login");

    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      setLoading(false); // Libera o botão em caso de erro

      if (error.response?.data) {
        const data = error.response.data;

        if (data.email) {
            // Tratamento para array ou string
            const msg = Array.isArray(data.email) ? data.email[0] : data.email;
            setError(msg);
            return;
        }
        if (data.error) {
            setError(data.error);
            return;
        }
      }
      
      setError("Não foi possível conectar ao servidor. Tente novamente.");
    }
  };

  return (
    <div className="h-screen flex text-gray-800 bg-[#1A225F] overflow-hidden" >
      <div className="w-1/2 h-screen hidden md:block" >
        <LadoLogoPage />
      </div>

      <div className="w-full md:w-1/2 h-screen bg-white flex flex-col justify-center items-center p-8 md:p-12">
        <div className="w-full max-w-sm">
          <h1 className="text-4xl font-bold mb-2 text-white md:text-gray-800 mb-4">
            Cadastre-se
          </h1>

          {error && (
            <p className="bg-red-100 text-red-700 text-center p-3 rounded-md mb-4 whitespace-pre-line border border-red-400">
              {error}
            </p>
          )}

          <form onSubmit={handleCadastro}>

            <div className="mb-4">
              <label className="block text-sm font-bold mb-2 text-white md:text-gray-800 text-[20px]" htmlFor="nome">
                Nome
              </label>
              <input id="nome"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite seu nome"
                className="shadow-sm w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-blue-700 focus:ring-2 focus:ring-main"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold mb-2 text-white md:text-gray-800 text-[20px]" htmlFor="email">
                E-mail
              </label>
              <input id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu e-mail"
                className="shadow-sm w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-blue-700 focus:ring-2 focus:ring-main"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold mb-2 text-white md:text-gray-800 text-[20px]" htmlFor="password">
                Senha
              </label>
              <input id="senha"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="shadow-sm w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-blue-700 focus:ring-2 focus:ring-main"
                required
              />
            </div>

            <button type="submit"
              disabled={loading}
              className={`mt-4 shadow-lg w-full bg-[#4858FF] md:bg-main text-main md:text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 active:opacity-80 transition duration-300 cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? "Criando..." : "Criar conta"}
            </button>

            <p className=" text-pink-100 md:text-gray-500 mb-8 mt-7">
              Já tem uma conta?{' '}
              <a href="/login" className="text-[#1A225F] md:text-main font-bold hover:underline">
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;