module.exports = {
  openapi: "3.0.0",
  info: {
    title: "MediBook API",
    version: "1.0.0",
    description: "Core API for Doctor Appointment Management"
  },
  servers: [{ url: "https://medibook-api-1vad.onrender.com" }],
  paths: {
    "/auth/register": {
      post: {
        summary: "Register User & Profile",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password", "name", "mobile"],
                properties: {
                  name: { type: "string", example: "Aa" },
                  email: { type: "string", example: "aa@gmail.com" },
                  password: { type: "string", example: "password123" },
                  mobile: { type: "string", example: "1234567890" },
                  role: { type: "string", enum: ["PATIENT", "DOCTOR"], default: "PATIENT" }
                }
              }
            }
          }
        },
        responses: { 201: { description: "Success" }, 400: { description: "Error" } }
      }
    },
    "/auth/login": {
      post: {
        summary: "Get JWT Token",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", example: "aa@gmail.com" },
                  password: { type: "string", example: "password123" }
                }
              }
            }
          }
        },
        responses: { 200: { description: "Returns JWT" } }
      }
    },
    "/doctors": {
      get: {
        summary: "List Doctors (Public)",
        tags: ["Doctors"],
        responses: {
          200: {
            description: "Clean doctor list",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string", example: "doc_uuid_1" },
                      name: { type: "string", example: "Dr. Smith" },
                      specialization: { type: "string", example: "Cardio" },
                      price:{type:"integer",example:1000},
                      phone: { type: "string", example: "123456789" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/appointments": {
  post: {
    summary: "Create appointment & Generate Razorpay Order",
    tags: ["Appointments"],
    security: [{ bearerAuth: [] }],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["doctorId", "date"],
            properties: {
              doctorId: { type: "integer", example: 1 },
              date: { type: "string", format: "date-time", example: "2026-03-10T10:00:00.000Z" }
            }
          }
        }
      }
    },
    responses: {
      201: { 
        description: "Appointment created and Razorpay order generated",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                id: { type: "integer" },
                razorpayOrderId: { type: "string" },
                amount: { type: "integer" },
                doctor: { 
                  type: "object",
                  properties: { name: { type: "string" } }
                }
              }
            }
          }
        }
      },
      404: { description: "Doctor not available at this time" }
    }
  }
}
  }
};