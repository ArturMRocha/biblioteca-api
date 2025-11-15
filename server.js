const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy; // <-- IMPORTAR ESTRATÉGIA

// --- LÓGICA DO PASSPORT ---
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback"
  },
  (accessToken, refreshToken, profile, done) => {
    // Aqui você poderia salvar/procurar o usuário no seu DB
    // Por enquanto, vamos apenas confiar no perfil do GitHub
    return done(null, profile);
  }
));

// Salva o usuário na sessão
passport.serializeUser((user, done) => {
  done(null, user);
});

// Remove o usuário da sessão
passport.deserializeUser((user, done) => {
  done(null, user);
});

const app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Mude para 'true' em produção (https://)
}));
app.use(passport.initialize());
app.use(passport.session());

// Rota principal
app.use('/', require('./routes'));

// Inicia o banco e o servidor
mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port} e conectado ao DB.`);
    });
  }
});