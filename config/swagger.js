const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const docSpec = require('../docs/swagger-spec.js'); 
const swaggerSpec = require('../docs/swagger-spec.js');

const options = {
  swaggerDefinition: swaggerSpec, // Use the object directly
  apis: [], // Leave this empty so it doesn't try to "scan" files
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};