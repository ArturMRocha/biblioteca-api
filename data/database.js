// data/database.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

let db;

const initDb = (callback) => {
  if (db) {
    console.log('O banco de dados já está inicializado!');
    return callback(null, db);
  }
  MongoClient.connect(process.env.MONGODB_URI)
    .then((client) => {
      db = client.db(); // Conecta ao DB especificado na URI
      console.log('Conectado ao MongoDB com sucesso!');
      callback(null, db);
    })
    .catch((err) => {
      callback(err);
    });
};

const getDatabase = () => {
  if (!db) {
    throw new Error('O banco de dados não foi inicializado.');
  }
  return db;
};

module.exports = {
  initDb,
  getDatabase
};