const path = require('path'); 

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MediBook API',
      version: '1.0.0',
    },
    servers: [{ url: 'https://medibook-api-1vad.onrender.com' }],
  },
  
  apis: [path.join(__dirname, '../docs/swagger-spec.js')], 
};