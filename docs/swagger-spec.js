module.exports = {
  openapi: "3.0.0",
  info: {
    title: "MediBook API",
    version: "1.0.0",
  },
  servers: [{ url: "https://medibook-api-1vad.onrender.com" }],
  paths: {
    "/auth/register": {
      post: {
        summary: "Register a new user",
        tags: ["Auth"],
        responses: {
          201: { description: "User registered" }
        }
      }
    },
    "/auth/login": {
      post: {
        summary: "Login and get JWT",
        tags: ["Auth"],
        responses: {
          200: { description: "Returns JWT token" }
        }
      }
    },
    "/appointments": {
      get: {
        summary: "Get user appointments",
        tags: ["Appointments"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "List retrieved" }
        }
      },
      post: {
        summary: "Create appointment",
        tags: ["Appointments"],
        security: [{ bearerAuth: [] }],
        responses: {
          201: { description: "Created" }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  }
};