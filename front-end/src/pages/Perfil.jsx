import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Importe a API configurada
import BarraLateral from '../components/BarraLateral';
import cidadesPE from "../data/cidadesPE.json";

function Perfil() {
  const navigate = useNavigate();

  // Estados do formulário
  const [cidade, setCidade] = useState("");
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  
  // Estados de controle
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const userId = localStorage.getItem("userId"); // Pega o ID salvo no Login

  // 1. Carregar dados da API ao abrir a tela
  useEffect(() => {
    if (!userId) {
      alert("Usuário não logado!");
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        // GET http://localhost:4000/users/{id}
        const response = await api.get(`/users/${userId}`);
        console.log("Dados do usuário:", response.data);
        setNome(response.data.name || "");
        setCidade(response.data.city || ""); // Importante para o sistema de alertas
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        alert("Erro ao carregar dados do usuário.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, navigate]);

  // 2. Enviar alterações para a API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Monta o objeto. Se a senha estiver vazia, não enviamos ou enviamos vazia (o back trata)
      const payload = {
        name: nome,
        city: cidade,
        password: senha // O backend só troca se isso tiver valor
      };

      // PUT http://localhost:4000/users/{id}
      await api.put(`/users/${userId}`, payload);

      alert("Perfil atualizado com sucesso!");
      setSenha(""); // Limpa o campo de senha por segurança
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      alert("Erro ao salvar alterações.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 text-gray-600">
        Carregando perfil...
      </div>
    );
  }

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
                  placeholder="Seu nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-700 outline-none"
                  required
                />
              </div>

              {/* SENHA */}
              <div className="flex flex-col">
                <label className="font-bold mb-1">Nova Senha (Opcional)</label>
                <input
                  name="password"
                  type="password"
                  placeholder="Deixe em branco para manter a atual"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-700 outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Preencha apenas se quiser alterar sua senha.</p>
              </div>

              {/* CIDADE */}
              <div className="flex flex-col">
                <label className="font-bold mb-1">Cidade (Para Alertas Climáticos)</label>
                <select
                  name="city"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  className="cursor-pointer w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-700 outline-none"
                  required
                >
                  <option value="">Selecione uma cidade</option>
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
                  disabled={saving}
                  className={`w-full bg-[#4858FF] text-white font-bold py-3 rounded-lg hover:opacity-90 transition disabled:bg-gray-400 cursor-pointer ${saving ? 'cursor-wait' : ''}`}
                >
                  {saving ? "Salvando..." : "Salvar Alterações"}
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