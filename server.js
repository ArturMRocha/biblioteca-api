// server.js (Versão Corrigida e Completa)
const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const MongoStore = require('connect-mongo'); // <-- IMPORTAR MONGOSTORE

// --- LÓGICA DO PASSPORT (no topo) ---
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback" // ✅ AQUI ESTÁ A CORREÇÃO 1
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
    secure: true // ✅ AQUI ESTÁ A CORREÇÃO 2 (para https)
  },
}));

// --- INICIALIZE O PASSPORT ---
// (Deve vir DEPOIS da sessão)
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