// swagger.js (na raiz)
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'API da Biblioteca',
    description: 'API para gerenciar livros e membros (patrons).'
  },
  host: 'biblioteca-api-jdiz.onrender.com', // Mude para seu host do Render depois
  schemes: ['https'],      // Mude para ['https'] no Render
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/index.js']; // Aponte para o index.js

// Gera o swagger-output.json
swaggerAutogen(outputFile, endpointsFiles, doc);