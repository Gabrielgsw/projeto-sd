import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BarraLateral from '../components/BarraLateral';
import cidadesPE from "../data/cidadesPE.json";

function Perfil() {
  const navigate = useNavigate();

  const [cidade, setCidade] = useState("");
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");

  const [userData, setUserData] = useState(null);

  // Carregar dados locais do usuário
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user_data"));

    if (savedUser) {
      setUserData(savedUser);
      setNome(savedUser.username || "");
      setCidade(savedUser.city || "");
      setSenha(""); // nunca exibir senha real
    }
  }, []);

  // Salvar alterações no localStorage
  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedUser = {
      ...userData,
      username: nome,
      city: cidade,
      password: senha || userData?.password, // mantém a antiga se não alterar
    };

    localStorage.setItem("user_data", JSON.stringify(updatedUser));

    alert("Perfil atualizado (localStorage)!");
  };

  return (
    <div className="h-screen text-gray-800 flex flex-col min-w-[1024px] bg-gray-50">
      <div className="flex flex-1 overflow-hidden">
        <BarraLateral />

        <div className="flex-1 flex flex-col py-14 overflow-y-auto relative">
          <div className="w-full max-w-xl mx-auto">
            <h1 className="text-3xl font-semibold mb-6 text-center">Editar seu perfil</h1>

            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-6 flex flex-col gap-4">

              {/* NOME */}
              <div className="flex flex-col">
                <label className="font-bold mb-1">Nome</label>
                <input
                  name="username"
                  type="text"
                  placeholder={userData?.username || "Digite um novo nome"}
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-700 outline-none"
                />
              </div>

              {/* SENHA */}
              <div className="flex flex-col">
                <label className="font-bold mb-1">Senha</label>
                <input
                  name="password"
                  type="password"
                  placeholder="Digite uma nova senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-700 outline-none"
                />
              </div>

              {/* CIDADE */}
              <div className="flex flex-col">
                <label className="font-bold mb-1">Cidade</label>
                <select
                  name="city"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  className="cursor-pointer w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-700 outline-none"
                >
                  <option value="">
                    {userData?.city ? `Atual: ${userData.city}` : "Selecione uma cidade"}
                  </option>

                  {cidadesPE.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* BOTÃO */}
              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full bg-[#4858FF] text-white font-bold py-3 rounded-lg hover:opacity-90 transition disabled:bg-orange-300 cursor-pointer"
                >
                  Salvar Alterações
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Perfil;
