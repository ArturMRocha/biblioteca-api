// controllers/books.js
const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

// Função de ajuda para validar IDs do MongoDB
const isValidId = (id) => {
  if (ObjectId.isValid(id)) {
    // Verifica se o ID é uma string de 24 caracteres hexadecimais
    if (String(new ObjectId(id)) === id) {
      return true;
    }
  }
  return false;
};

// --- GET (Leitura) ---

// GET /books
const getAllBooks = async (req, res) => {
  try {
    const result = await mongodb.getDatabase().collection('books').find();
    const books = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Erro interno do servidor.' });
  }
};

// GET /books/:id
const getSingleBook = async (req, res) => {
  // Validação de erro: Checa se o ID é válido
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ message: 'ID fornecido não é válido.' });
  }
  
  const bookId = new ObjectId(req.params.id);

  try {
    const result = await mongodb.getDatabase().collection('books').findOne({ _id: bookId });
    if (result) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result);
    } else {
      // Erro 404: Não encontrou o livro
      res.status(404).json({ message: 'Livro não encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Erro interno do servidor.' });
  }
};

// --- POST (Criação) ---

// POST /books
const createBook = async (req, res) => {
  // A validação do body (campos obrigatórios) será feita no middleware depois
  try {
    const book = {
      title: req.body.title,
      author: req.body.author,
      isbn: req.body.isbn,
      publishedYear: req.body.publishedYear,
      genre: req.body.genre,
      summary: req.body.summary,
      status: req.body.status
    };

    const result = await mongodb.getDatabase().collection('books').insertOne(book);
    if (result.acknowledged) {
      res.status(201).json({ id: result.insertedId });
    } else {
      res.status(500).json({ message: 'Erro ao criar o livro.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Erro interno do servidor.' });
  }
};

// --- PUT (Atualização) ---

// PUT /books/:id
const updateBook = async (req, res) => {
  // Validação de erro: Checa se o ID é válido
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ message: 'ID fornecido não é válido.' });
  }

  const bookId = new ObjectId(req.params.id);

  try {
    const updateData = {
      title: req.body.title,
      author: req.body.author,
      isbn: req.body.isbn,
      publishedYear: req.body.publishedYear,
      genre: req.body.genre,
      summary: req.body.summary,
      status: req.body.status
    };

    const result = await mongodb.getDatabase().collection('books').updateOne(
      { _id: bookId },
      { $set: updateData }
    );

    if (result.modifiedCount > 0) {
      res.status(204).send(); // 204 = Sucesso, sem conteúdo
    } else {
      // Erro 404: Não encontrou o livro para atualizar
      res.status(404).json({ message: 'Livro não encontrado ou dados não alterados.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Erro interno do servidor.' });
  }
};

// --- DELETE (Remoção) ---

// DELETE /books/:id
const deleteBook = async (req, res) => {
  // Validação de erro: Checa se o ID é válido
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ message: 'ID fornecido não é válido.' });
  }

  const bookId = new ObjectId(req.params.id);

  try {
    const result = await mongodb.getDatabase().collection('books').deleteOne({ _id: bookId });
    if (result.deletedCount > 0) {
      res.status(204).send(); // 204 = Sucesso, sem conteúdo
    } else {
      // Erro 404: Não encontrou o livro para deletar
      res.status(404).json({ message: 'Livro não encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Erro interno do servidor.' });
  }
};

module.exports = {
  getAllBooks,
  getSingleBook,
  createBook,
  updateBook,
  deleteBook
};