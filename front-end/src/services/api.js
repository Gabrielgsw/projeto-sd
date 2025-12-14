import axios from "axios";

// Aponta APENAS para o Gateway
const api = axios.create({
  baseURL: "http://localhost:4000", 
});

export default api;