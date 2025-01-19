const express = require('express');
const session = require('express-session');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 5000;

//---------------------- CONFIGURAÇÕES INICIAIS -------------------------

// Configuração do middleware CORS
app.use(cors({
    origin: (origin, callback) => {
        callback(null, true);
    },
    methods: ['GET', 'POST'], 
    allowedHeaders: ['Content-Type'], 
    credentials: true,
}));

// Configuração da sessão
app.use(session({
    secret: 'sdbfiweufhajakjfhqpnbnfwifba',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true, 
        secure: false,
        maxAge: 3600000,   // 1 hora de duração para cookie
    },
}));

// Middleware para analisar JSON 
app.use(express.json());

// Servindo frontend
// app.use(express.static(path.join(__dirname, 'frontend', 'workstream', 'build')));

//-------------------------------- DEFINIÇÃO DE ROTAS -------------------------

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'workstream', 'build', 'index.html'));
});

// Rota de login
const userRoutes = require('./src/routes/user');
app.use('/users', userRoutes);

// Rota de grupos
const groupRoutes = require('./src/routes/groups');
app.use('/groups', groupRoutes);

// Rota de tasks
const taskRoutes = require('./src/routes/tasks');
app.use('/tasks', taskRoutes);


//-------------------------------- INICIANDO O SERVIDOR -------------------------

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor backend rodando em http://0.0.0.0:${PORT}`);
});