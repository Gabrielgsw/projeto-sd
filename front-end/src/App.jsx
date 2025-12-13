import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Cadastro from "./pages/Cadastro.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Noticias from "./pages/Noticias.jsx";
import Clima from "./pages/Clima.jsx";
import Alertas from "./pages/Alertas.jsx";
import Perfil from "./pages/Perfil.jsx";

export default function App() {
  return (
    <Router>
      <Routes>

        {/* Rota inicial -> login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Telas principais */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/noticias" element={<Noticias />} />
        <Route path="/clima" element={<Clima />} />
        <Route path="/alertas" element={<Alertas />} />
        <Route path="/perfil" element={<Perfil />} />

      </Routes>
    </Router>
  );
}