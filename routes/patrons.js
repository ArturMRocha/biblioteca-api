// routes/patrons.js
const express = require('express');
const router = express.Router();
const patronsController = require('../controllers/patrons');

// Importa o 'isAuthenticated' e a validação (APENAS UMA VEZ)
const { patronValidationRules, validate, isAuthenticated } = require('../middleware/validation');

// GET (Leitura) - Públicas
router.get('/', patronsController.getAllPatrons);
router.get('/:id', patronsController.getSinglePatron);

// POST (Criação) - Protegida
router.post('/', isAuthenticated, patronValidationRules(), validate, patronsController.createPatron);

// PUT (Atualização) - Protegida
router.put('/:id', isAuthenticated, patronValidationRules(), validate, patronsController.updatePatron);

// DELETE (Remoção) - Protegida
router.delete('/:id', isAuthenticated, patronsController.deletePatron);

module.exports = router;