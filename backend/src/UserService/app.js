const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3003;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_dev';

app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
  res.send('UserService is running on port ' + PORT);
});

// =========================================================
// ROTA DE REGISTRO (Cria usuário + Criptografa Senha)
// =========================================================
app.post('/auth/register', async (req, res) => {
  const { name, email, password, city } = req.body;

  // Validação básica
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Todos os campos (name, email, password) são obrigatórios." });
  }

  try {
    // 1. Verifica se usuário já existe
    const userExists = await prisma.user.findUnique({
      where: { email: email }
    });

    if (userExists) {
      return res.status(400).json({ error: "E-mail já cadastrado." });
    }

    // 2. Criptografa a senha (Hash)
    // O '10' é o custo do processamento (Salt rounds). Quanto maior, mais seguro e mais lento.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Cria o usuário no banco
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword, // Salva o hash, NUNCA a senha pura
        city
      }
    });

    // Remove a senha do objeto de retorno por segurança
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({ 
      message: "Usuário criado com sucesso!",
      user: userWithoutPassword 
    });

  } catch (error) {
    console.error("Erro no registro:", error);
    res.status(500).json({ error: "Erro interno ao criar usuário." });
  }
});

// =========================================================
// ROTA DE LOGIN (Verifica Senha + Gera Token)
// =========================================================
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "E-mail e senha são obrigatórios." });
  }

  try {
    // 1. Busca usuário pelo email
    const user = await prisma.user.findUnique({
      where: { email: email }
    });

    if (!user) {
      return res.status(400).json({ error: "Credenciais inválidas." });
    }

    // 2. Compara a senha enviada com o Hash do banco
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Credenciais inválidas." });
    }

    // 3. Gera o Token JWT
    // Esse token contém o ID e a Cidade do usuário, e expira em 1 dia
    const token = jwt.sign(
      { id: user.id, city: user.city }, 
      JWT_SECRET, 
      { expiresIn: '1d' }
    );

    // Retorna token e dados do usuário (úteis para o Front já carregar o clima)
    res.json({
      message: "Login realizado com sucesso!",
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        city: user.city // O Frontend vai usar isso para chamar o WeatherService!
      }
    });

  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ error: "Erro interno no login." });
  }
});

// =========================================================
// ROTA DE PERFIL (Exemplo de rota protegida)
// =========================================================
app.get('/users/me', async (req, res) => {
  // Pega o token do cabeçalho "Authorization: Bearer <token>"
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: "Token não fornecido." });
  }

  const token = authHeader.split(' ')[1]; // Remove o 'Bearer '

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) return res.status(404).json({ error: "Usuário não encontrado." });

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);

  } catch (error) {
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
});

app.listen(PORT, () => {
  console.log(`UserService rodando na porta ${PORT}`);
});