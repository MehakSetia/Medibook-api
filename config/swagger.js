const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MediBook API',
      version: '1.0.0',
    },
    servers: [{ url: 'https://medibook-api-1vad.onrender.com' }],
  },
  // Point specifically to your new spec file
  apis: ['./docs/swagger-spec.js'], 
};