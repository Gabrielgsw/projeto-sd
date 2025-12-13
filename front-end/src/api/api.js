// chamadas de API
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/",    // url local
  //baseURL: "https://procurai.duckdns.org/api/", // url produção
});

const getBaseURL = "localhost:8080/"; // Função para obter a base URL

// === INTERCEPTOR DE REQUISIÇÃO ===
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// === INTERCEPTOR DE RESPOSTA ===
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Verifica se a requisição existe (erro de rede pode não ter config)
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // --- CORREÇÃO CRÍTICA AQUI ---
    // Ignora URLs de Login E de Refresh para evitar loops infinitos.
    // Se o refresh falhar com 401, ele deve cair direto no catch, não tentar refresh de novo.
    if (
      originalRequest.url.includes('user/token/') ||       // Login
      originalRequest.url.includes('user/token-refresh/')  // Refresh Token
    ) {
      return Promise.reject(error);
    }

    // Verifica se o erro é 401 e se ainda não tentamos atualizar
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        console.error("Refresh token não encontrado. Deslogando.");
        // Função de logout limpo
        handleLogout();
        return Promise.reject(error);
      }

      try {
        // Chama a rota de refresh
        const response = await api.post('user/token-refresh/', {
          refresh: refreshToken
        });

        const newAccessToken = response.data.access;

        // Atualiza o token no storage
        localStorage.setItem('accessToken', newAccessToken);

        // Atualiza o header da requisição que falhou com o novo token
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // Retenta a requisição original
        return api(originalRequest);

      } catch (refreshError) {
        console.error("Falha ao renovar token. Sessão expirada.", refreshError);
        // Se o refresh falhar, desloga o usuário
        handleLogout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Função auxiliar para logout (evita repetição de código)
function handleLogout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userId');

  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
}

export default api;