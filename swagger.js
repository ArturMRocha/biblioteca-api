// swagger.js (na raiz)
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'API da Biblioteca',
    description: 'API para gerenciar livros e membros (patrons).'
  },
  host: 'localhost:3000', // Mude para seu host do Render depois
  schemes: ['http'],      // Mude para ['https'] no Render
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/index.js']; // Aponte para o index.js

// Gera o swagger-output.json
swaggerAutogen(outputFile, endpointsFiles, doc);