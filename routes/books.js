// routes/books.js
const express = require('express');
const router = express.Router();
const booksController = require('../controllers/books');

// Importa o 'isAuthenticated' e a validação (APENAS UMA VEZ)
const { bookValidationRules, validate, isAuthenticated } = require('../middleware/validation');

// GET (Leitura) - Públicas
router.get('/', booksController.getAllBooks);
router.get('/:id', booksController.getSingleBook);

// POST (Criação) - Protegida
router.post('/', isAuthenticated, bookValidationRules(), validate, booksController.createBook);

// PUT (Atualização) - Protegida
router.put('/:id', isAuthenticated, bookValidationRules(), validate, booksController.updateBook);

// DELETE (Remoção) - Protegida
router.delete('/:id', isAuthenticated, booksController.deleteBook);

module.exports = router;