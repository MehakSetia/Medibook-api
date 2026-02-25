const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MediBook API',
      version: '1.0.0',
      description: 'API for Doctor Appointment System',
    },
    servers: [{ url: 'https://medibook-api-1vad.onrender.com' }],
  },
  apis: [], 
};

const specs = swaggerJsdoc(options);


module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};