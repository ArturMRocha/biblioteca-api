// server.js (Versão Corrigida SEM connect-mongo)
const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
// NENHUMA menção a connect-mongo

// --- LÓGICA DO PASSPORT (no topo) ---
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback" // ✅ Correção 1: Caminho Relativo
  },
  (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
// -------------------------

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// --- CONFIGURAÇÃO DE SESSÃO (Corrigida) ---
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: true // ✅ Correção 2: Seguro para https
  }
  // Sem o 'store: MongoStore'
}));

// --- INICIALIZE O PASSPORT ---
app.use(passport.initialize());
app.use(passport.session());

// --- CORS E ROTAS ---
app.use(cors());
app.use('/', require('./routes'));

// --- INICIA O SERVIDOR ---
mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port} e conectado ao DB.`);
    });
  }
});