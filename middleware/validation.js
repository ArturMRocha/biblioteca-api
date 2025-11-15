// middleware/validation.js
const { body, validationResult } = require('express-validator');

/**
 * Regras para a coleção 'books' (7 campos)
 */
const bookValidationRules = () => {
  return [
    // title não pode estar vazio
    body('title').notEmpty().withMessage('O título é obrigatório.'),
    
    // author não pode estar vazio
    body('author').notEmpty().withMessage('O autor é obrigatório.'),
    
    // isbn deve ser um ISBN (formato simples)
    body('isbn').isISBN().withMessage('Deve ser um ISBN válido.'),
    
    // publishedYear deve ser um número inteiro (ano)
    body('publishedYear').isInt({ min: 1000, max: new Date().getFullYear() }).withMessage('Ano de publicação inválido.'),
    
    // genre não pode estar vazio
    body('genre').notEmpty().withMessage('O gênero é obrigatório.'),
    
    // summary não pode estar vazio
    body('summary').notEmpty().withMessage('O sumário é obrigatório.'),
    
    // status deve ser um dos valores permitidos
    body('status').isIn(['Available', 'Checked Out']).withMessage('Status inválido (deve ser "Available" ou "Checked Out").')
  ];
};

/**
 * Regras para a coleção 'patrons'
 */
const patronValidationRules = () => {
    return [
      body('firstName').notEmpty().withMessage('O primeiro nome é obrigatório.'),
      body('lastName').notEmpty().withMessage('O sobrenome é obrigatório.'),
      body('email').isEmail().withMessage('Deve ser um e-mail válido.'),
      body('libraryCardNumber').isLength({ min: 5, max: 10 }).withMessage('O número do cartão deve ter entre 5 e 10 caracteres.')
    ];
};

/**
 * Função genérica que checa os erros de validação
 * Se houver erros, retorna 400. Se não, passa para o próximo middleware (o controlador).
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next(); // Sem erros, continua
  }
  
  // Há erros. Formata e retorna 400.
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }));

  return res.status(400).json({
    message: "Erro de validação.",
    errors: extractedErrors
  });
};

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next(); // O usuário está logado, continue
  }
  // O usuário não está logado, envie um erro 401
  res.status(401).json({ message: 'Não autorizado. Por favor, faça login primeiro.' });
};

// Exporta tudo
module.exports = {
  bookValidationRules,
  patronValidationRules,
  validate,
  isAuthenticated
};