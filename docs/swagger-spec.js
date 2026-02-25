module.exports = {
  openapi: "3.0.0",
  info: {
    title: "MediBook API",
    version: "1.0.0",
    description: "API for Doctor Appointment System"
  },
  servers: [{ url: "https://medibook-api-1vad.onrender.com" }],
  paths: {
    "/auth/register": {
      post: {
        summary: "Register a new user",
        tags: ["Auth"],
        responses: { 201: { description: "User registered" } }
      }
    },
    "/auth/login": {
      post: {
        summary: "Login and get JWT",
        tags: ["Auth"],
        responses: { 200: { description: "Returns JWT token" } }
      }
    },
    "/appointments": {
      get: {
        summary: "Get user appointments",
        tags: ["Appointments"],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "Success" } }
      },
      post: {
        summary: "Create appointment",
        tags: ["Appointments"],
        security: [{ bearerAuth: [] }],
        responses: { 201: { description: "Created" } }
      }
    },
    "/appointments/cancel": {
      post: {
        summary: "Cancel appointment",
        tags: ["Appointments"],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "Cancelled" } }
      }
    },
    "/doctors": {
      get: {
        summary: "List all doctors",
        tags: ["Doctors"],
        responses: { 200: { description: "Success" } }
      },
      post: {
        summary: "Add doctor details",
        tags: ["Doctors"],
        security: [{ bearerAuth: [] }],
        responses: { 201: { description: "Doctor added" } }
      }
    },
    "/schedule/create": {
      post: {
        summary: "Create doctor slots",
        tags: ["Schedule"],
        security: [{ bearerAuth: [] }],
        responses: { 201: { description: "Slots created" } }
      }
    },
    "/schedule/{doctorId}": {
      get: {
        summary: "Get doctor schedule",
        tags: ["Schedule"],
        parameters: [{
          in: "path",
          name: "doctorId",
          required: true,
          schema: { type: "string" }
        }],
        responses: { 200: { description: "Success" } }
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