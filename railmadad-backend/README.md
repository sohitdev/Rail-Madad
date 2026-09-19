# RailMadad - Backend API

This is the core REST API and WebSocket server for the RailMadad Grievance Management System.

## Tech Stack
- **Node.js & Express** (Server)
- **MySQL2** (Relational Database)
- **Socket.io** (Real-time WebSockets)
- **Google Gemini AI** (Ticket Classification)
- **Nodemailer** (SMTP Email/OTP pipeline)
- **Multer** (File Upload Handling)
- **JSON Web Tokens (JWT)** (Admin Authentication)

## Architecture Overview
- `/src/server.js`: Application entrypoint, sets up Express middleware, CORS, and Socket.io.
- `/src/config/db.js`: MySQL connection pool and automatic schema generation (`ensureSchema`).
- `/src/controllers/`: Contains logic for Admin actions and Complaint routing.
- `/src/utils/classifier.js`: Prompts the Google Gemini API to analyze incoming complaint text, returning a structured JSON response with Department and Priority (`High`, `Medium`, `Low`).
- `/src/utils/mailer.js`: Nodemailer configuration for sending OTPs and Status Updates securely.

## Environment Variables
The backend relies on the root `.env` file. It resolves the path dynamically:
```js
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
```
*Ensure you have configured `DB_HOST`, `GEMINI_API_KEY`, and `SMTP_PASS` in the root folder before starting the server.*

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   ```
   *(The server will run on `PORT 3000` by default and automatically generate required MySQL tables).*

*For complete project documentation, see the [Root README](../README.md).*
