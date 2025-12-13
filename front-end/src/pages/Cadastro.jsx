import React, { useState } from "react";
import LadoLogoPage from "../components/LadoLogoPage";
import { useNavigate } from "react-router-dom";
// import api from "../api/api";

function Cadastro() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();
    setError("");

    if (!password.trim()) {
      setError("Insira uma senha válida.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Insira um e-mail válido.");
      return;
    }

    const passwordRegex = /^[A-Za-z0-9!@#$%&*.\-_?]{8,}$/;
    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (!passwordRegex.test(password)) {
      setError("Insira uma senha válida.");
      return;
    }

    if (password !== confirmacao) {
      setError("As senhas não coincidem.");
      return;
    }


    try {
      const response = await api.post("user/register/tela1/", {
        email: email,
        password: password,
        password_confirm: confirmacao,
      });
      console.log("Resposta da API:", response.data);
      //const id = response.data.user_id;
      //sessionStorage.setItem("user_id", id)
      navigate("/login");

    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);

      if (error.response?.data) {
        const data = error.response.data;

        // E-mail já existe
        if (data.email) {
          setError("Este e-mail já está cadastrado.");
          return;
        }

        // Senha inválida
        if (data.password) {
          setError(data.password[0]);
          return;
        }

        // Outros erros conhecidos
        if (data.password_confirm) {
          setError(data.password_confirm[0]);
          return;
        }

        // Caso backend mande algo inesperado
        setError("Erro ao cadastrar. Verifique os dados informados.");
        return;
      }

      // Caso sem resposta do servidor
      setError("Não foi possível conectar ao servidor.\nTente novamente.");
    }
  };

  return (
    <div className="h-screen flex text-gray-800 bg-[#1A225F] overflow-hidden" >
      <div className="w-1/2 h-screen" >
        <LadoLogoPage />
      </div>

      <div className="w-1/2 h-screen bg-white flex flex-col justify-center items-center p-8 md:p-12">
        <div className="w-full max-w-sm">
          <h1 className="text-4xl font-bold mb-2 text-white md:text-gray-800 mb-4">
            Cadastre-se
          </h1>

          {error && (
            <p className="bg-red-100 text-red-700 text-center p-3 rounded-md mb-4 whitespace-pre-line">
              {error}
            </p>
          )}

          <form onSubmit={handleCadastro}>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2 text-white md:text-gray-800 text-[20px] " htmlFor="email">
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
              <label className="block text-sm font-bold mb-2 text-white md:text-gray-800 text-[20px]" htmlFor="password">Senha</label>
              <input id="senha"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="shadow-sm w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-blue-700 focus:ring-2 focus:ring-main"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-white md:text-gray-800 text-[20px]" htmlFor="password">Confirmar senha</label>
              <input id="confirmacao"
                type="password"
                value={confirmacao}
                onChange={(e) => setConfirmacao(e.target.value)}
                placeholder="Confirmar senha"
                className="shadow-sm w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-main"
                required
              />
            </div>

            <button type="submit"
              className="mt-4 shadow-lg w-full bg-[#4858FF] md:bg-main text-main md:text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 active:opacity-80 transition duration-300 cursor-pointer"
              //onClick={handleCadastro}
            >
              Criar conta
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