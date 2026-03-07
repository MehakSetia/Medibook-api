const { type } = require("os");

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
        summary: "Register a new user and patient profile",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password", "name", "mobile"], // Required by your Prisma models
                properties: {
                  name: { type: "string", example: "Mehak Setia" },
                  email: { type: "string", example: "mehak@example.com" },
                  password: { type: "string", example: "password123" },
                  mobile: { type: "string", example: "9876543210" },
                  role: { 
                    type: "string", 
                    enum: ["PATIENT", "DOCTOR"], 
                    default: "PATIENT",
                    description: "Defaults to PATIENT based on your Role enum" 
                  }
                }
              }
            }
          }
        },
        responses: {
          201: { description: "User and Profile created successfully" },
          400: { description: "Email already exists or invalid input" }
        }
      }
    },
   "/auth/login": {
      post: {
        summary: "Login to get JWT",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", example: "mehak@example.com" },
                  password: { type: "string", example: "password123" }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Success" },
          401: { description: "Invalid credentials" }
        }
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
}
  
