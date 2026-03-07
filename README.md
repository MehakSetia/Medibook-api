# 🏥 MediBook API - Doctor Appointment System

A robust, production-ready backend built with **Node.js**, **Express**, and **Prisma**. MediBook handles the end-to-end flow of healthcare scheduling—from user authentication and doctor discovery to secure payment processing.

## 🚀 Live Demo & Documentation
- **API Documentation (Swagger):** [https://medibook-api-1vad.onrender.com/api-docs](https://medibook-api-1vad.onrender.com/api-docs)
- **Deployed Backend:** [https://medibook-api-1vad.onrender.com](https://medibook-api-1vad.onrender.com)

---

## 🛠️ Tech Stack
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** PostgreSQL (Hosted on Render/Aiven)
* **ORM:** Prisma (Type-safe database access)
* **Authentication:** JWT (JSON Web Tokens)
* **Payments:** Razorpay API Integration
* **Documentation:** Swagger UI (OpenAPI 3.0)

---

## ✨ Key Features & "Senior" Implementations

### 1. Secure Authentication & Role Management
- Implemented **JWT-based authentication** with custom middleware to protect private routes.
- Used **Bcrypt** for one-way password hashing with salts to prevent data breaches.
- **Role-Based Access Control (RBAC):** Distinct permissions for `PATIENTS` and `DOCTORS` using Prisma Enums.

### 2. Transaction-Safe Booking Flow
- **Atomic Transactions:** Used `prisma.$transaction` to ensure that an appointment is created **only if** the doctor's slot is successfully marked as `isBooked`. This prevents double-booking.
- **Input Validation:** Implemented strict server-side checks (e.g., Integer validation for IDs) to prevent database crashes and "garbage" data entry.

### 3. Integrated Payment Gateway
- Fully integrated with **Razorpay** to generate unique `orderId`s for each appointment.
- Handles automated receipt generation and status tracking (`PENDING` vs `PAID`).

### 4. API Security & Privacy
- **Data Sanitization:** Carefully filtered API responses to hide sensitive internal IDs (like `userId`) from public endpoints while maintaining UX by showing necessary info like `price` and `phone`.
- **RESTful Architecture:** Organized controllers and services for high maintainability.

---

## 🚦 Getting Started (Local Development)

1. **Clone the repo:**
   ```bash
   git clone https://github.com/MehakSetia/Medibook-api.git
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Setup Environment Variables (.env):**
   ```properties
   DATABASE_URL="your_postgresql_url"
   JWT_SECRET="your_secret_key"
   RAZORPAY_KEY_ID="your_key"
   RAZORPAY_KEY_SECRET="your_secret"
   ```
4. **Run Migrations:**
   ```bash
   npx prisma migrate dev
   ```
5. **Start the Server:**
   ```bash
   npm start
   ```
---

## 👨‍💻 Author

Built by Mehak Setia Passionate about scalable backend systems and cloud architecture.
