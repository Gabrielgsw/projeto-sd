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

// test
app.get('/', (req, res) => {
  res.send('UserService is running on port ' + PORT);
});


app.post('/register', async (req, res) => {
  const { email, password, name } = req.body;

  // Validação básica
  if (!email || !password) {
    return res.status(400).json({ error: "Email e senha são obrigatórios." });
  }

  try {
    
    const existingUser = await prisma.user.findUnique({
      where: { email: email }
    });

    if (existingUser) {
        return res.status(400).json({ email: ["Este e-mail já está cadastrado."] });
    }

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,       
        city: "Recife"      
      }
    });

    
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json(userWithoutPassword);

  } catch (error) {
    console.error("Erro no registro:", error);
    res.status(500).json({ error: "Erro interno ao criar usuário." });
  }
});



app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email e senha são obrigatórios." });
  }

  try {
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    // gera JWT
    const token = jwt.sign(
      { user_id: user.id, email: user.email }, 
      process.env.JWT_SECRET || 'segredo_super_secreto', 
      { expiresIn: '1h' }
    );

    
    res.json({
      access: token,
      refresh: "token_refresh_exemplo_se_quiser_implementar", 
      userId: user.id 
    });

  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

// rota para obter os dados do perfil
app.get('/users/me', async (req, res) => {
  // Pega o token do cabeçalho 
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

// rota para identificar o usuario
app.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) }
    });

    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    // Remove a senha antes de enviar pro front
    const { password, ...userData } = user;
    res.json(userData);

  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar perfil" });
  }
});

// rota para atualizar o perfil
app.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, city, password } = req.body;

  try {
    const dataToUpdate = {
      name,
      city
    };

    // Só atualiza a senha se o usuário digitou algo novo
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      dataToUpdate.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: dataToUpdate
    });

    // Remove senha do retorno
    const { password: _, ...userClean } = updatedUser;
    res.json(userClean);

  } catch (error) {
    console.error("Erro ao atualizar:", error);
    res.status(500).json({ error: "Erro ao atualizar perfil" });
  }
});

app.listen(PORT, () => {
  console.log(`UserService rodando na porta ${PORT}`);
});