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
  // This tells Render to look in the 'docs' folder relative to this file
  apis: [path.join(__dirname, '../docs/swagger-spec.js')], 
};