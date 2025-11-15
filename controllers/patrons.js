// controllers/patrons.js
const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

// Função de ajuda para validar IDs
const isValidId = (id) => {
  if (ObjectId.isValid(id)) {
    return String(new ObjectId(id)) === id;
  }
  return false;
};

// GET /patrons
const getAllPatrons = async (req, res) => {
  try {
    const result = await mongodb.getDatabase().collection('patrons').find();
    const patrons = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(patrons);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Erro interno do servidor.' });
  }
};

// GET /patrons/:id
const getSinglePatron = async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ message: 'ID fornecido não é válido.' });
  }
  const patronId = new ObjectId(req.params.id);
  try {
    const result = await mongodb.getDatabase().collection('patrons').findOne({ _id: patronId });
    if (result) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'Membro (patron) não encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Erro interno do servidor.' });
  }
};

// POST /patrons
const createPatron = async (req, res) => {
  try {
    const patron = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      libraryCardNumber: req.body.libraryCardNumber
    };
    const result = await mongodb.getDatabase().collection('patrons').insertOne(patron);
    if (result.acknowledged) {
      res.status(201).json({ id: result.insertedId });
    } else {
      res.status(500).json({ message: 'Erro ao criar o membro.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Erro interno do servidor.' });
  }
};

// PUT /patrons/:id
const updatePatron = async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ message: 'ID fornecido não é válido.' });
  }
  const patronId = new ObjectId(req.params.id);
  try {
    const updateData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      libraryCardNumber: req.body.libraryCardNumber
    };
    const result = await mongodb.getDatabase().collection('patrons').updateOne(
      { _id: patronId },
      { $set: updateData }
    );
    if (result.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Membro não encontrado ou dados não alterados.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Erro interno do servidor.' });
  }
};

// DELETE /patrons/:id
const deletePatron = async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ message: 'ID fornecido não é válido.' });
  }
  const patronId = new ObjectId(req.params.id);
  try {
    const result = await mongodb.getDatabase().collection('patrons').deleteOne({ _id: patronId });
    if (result.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Membro não encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Erro interno do servidor.' });
  }
};

module.exports = {
  getAllPatrons,
  getSinglePatron,
  createPatron,
  updatePatron,
  deletePatron
};