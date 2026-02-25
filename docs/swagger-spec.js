/**
 * @swagger
 * components:
 * securitySchemes:
 * bearerAuth:
 * type: http
 * scheme: bearer
 * bearerFormat: JWT
 *
 * paths:
 * /auth/register:
 * post:
 * summary: Register a new user
 * tags: [Auth]
 * responses:
 * 201:
 * description: User registered
 *
 * /auth/login:
 * post:
 * summary: Login and get JWT
 * tags: [Auth]
 * responses:
 * 200:
 * description: Returns JWT token
 *
 * /appointments:
 * post:
 * summary: Create appointment
 * tags: [Appointments]
 * security:
 * - bearerAuth: []
 * responses:
 * 201:
 * description: Created
 * get:
 * summary: Get user appointments
 * tags: [Appointments]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: List retrieved
 *
 * /appointments/{id}/status:
 * patch:
 * summary: Update appointment status
 * tags: [Appointments]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * responses:
 * 200:
 * description: Updated
 *
 * /appointments/cancel:
 * post:
 * summary: Cancel appointment
 * tags: [Appointments]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Cancelled
 *
 * /appointments/verify:
 * post:
 * summary: Verify appointment (Razorpay)
 * tags: [Appointments]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Verified
 */