const router = require('express').Router();
const passport = require('passport');

// Ainda não temos as rotas, mas vamos adicionar a /api-docs
router.use('/api-docs', require('./swagger'));

router.use('/books', require('./books'));

router.use('/patrons', require('./patrons'));

// Rota de Login: redireciona para o GitHub
router.get('/login', passport.authenticate('github'));

// Rota de Logout: destrói a sessão
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/'); // Redireciona para a home
  });
});

// Rota de Callback: O GitHub redireciona para cá após o login
router.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/api-docs' }),
  (req, res) => {
    // Login bem-sucedido, redireciona para a documentação
    res.redirect('/api-docs');
  }
);

module.exports = router;