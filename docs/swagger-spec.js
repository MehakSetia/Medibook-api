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
 *   /auth/register:
 *     post:
 *       summary: Register a new user
 *       tags: [Auth]
 *       responses:
 *         201:
 *           description: User registered
 *   /auth/login:
 *     post:
 *       summary: Login and get JWT
 *       tags: [Auth]
 *       responses:
 *         200:
 *           description: Returns JWT token
 *   /appointments:
 *     post:
 *       summary: Create appointment
 *       tags: [Appointments]
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         201:
 *           description: Created
 *     get:
 *       summary: Get user appointments
 *       tags: [Appointments]
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: List retrieved
 *   /appointments/cancel:
 *     post:
 *       summary: Cancel appointment
 *       tags: [Appointments]
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Cancelled
 *   /doctors:
 *     get:
 *       summary: List all doctors
 *       tags: [Doctors]
 *       responses:
 *         200:
 *           description: Success
 *   /schedule/create:
 *     post:
 *       summary: Create doctor slots
 *       tags: [Schedule]
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         201:
 *           description: Slots created
 *   /schedule/{doctorId}:
 *     get:
 *       summary: Get doctor schedule
 *       tags: [Schedule]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *       name: doctorId
 *       required: true
 *       schema:
 *       type: string
 *       responses:
 *         200:
 *           description: Success
 */