/**
 * @swagger
 * components:
 * securitySchemes:
 * bearerAuth:
 * type: http
 * scheme: bearer
 * bearerFormat: JWT
 *
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
 * description: returns JWT token
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
 *
 * /doctors:
 * post:
 * summary: Add doctor details
 * tags: [Doctors]
 * security:
 * - bearerAuth: []
 * responses:
 * 201:
 * description: Added
 * get:
 * summary: List all doctors
 * tags: [Doctors]
 * responses:
 * 200:
 * description: Success
 *
 * /schedule/create:
 * post:
 * summary: Create doctor slots
 * tags: [Schedule]
 * security:
 * - bearerAuth: []
 * responses:
 * 201:
 * description: Slots created
 *
 * /schedule/{doctorId}:
 * get:
 * summary: Get doctor schedule
 * tags: [Schedule]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: doctorId
 * required: true
 * responses:
 * 200:
 * description: Schedule retrieved
 *
 * /schedule/remove/{slotId}:
 * delete:
 * summary: Remove a slot
 * tags: [Schedule]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: slotId
 * required: true
 * responses:
 * 200:
 * description: Slot removed
 */