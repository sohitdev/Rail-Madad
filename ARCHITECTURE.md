# RailMadad – Full Stack Architecture & Infrastructure Report

This document outlines the complete technical architecture, libraries, APIs, and cloud infrastructure used to build and deploy the RailMadad Grievance Management System.

---

## 1. The Frontend (Client-Side Interface)
*Where the passenger and admin interact with the application.*

- **React 18 & Vite:** Used to build and bundle the user interface. Vite was chosen over Create React App because it compiles significantly faster and provides a much smaller, highly optimized build for production.
- **Tailwind CSS v4:** Used for all styling. We strictly followed an "anti-slop" UI standard, creating custom bento-grid layouts, responsive flexboxes, and a sleek dark-mode admin portal without writing messy custom CSS files.
- **React Router v6:** Used to implement a Single Page Application (SPA). It allows users to switch between the Home Page, Complaint Form, Status Tracker, and Admin Portal instantly without the browser refreshing.
- **Axios:** The HTTP client used to fetch and send data to the backend. We built a custom **Axios Interceptor** (`api.js`) that automatically intercepts every request going to `/admin` and secretly attaches the admin's JWT token to verify their identity.

---

## 2. The Backend (Server-Side API)
*The brain of the operation that processes logic and handles security.*

- **Node.js & Express.js:** The core server. We structured it using the **MVC (Model-View-Controller)** pattern, splitting routing (`routes/`), business logic (`controllers/`), and configurations (`config/`) into separate files so the codebase can scale cleanly.
- **Multer:** Used as middleware to handle `multipart/form-data`. When a passenger uploads a photo of a dirty train coach, Multer intercepts the image stream, saves it to the backend file system, and passes the filename to the database.
- **JSON Web Tokens (JWT):** Used for Admin authentication. Instead of storing sessions in the server's memory, the server signs a cryptographic token when the admin logs in. The admin's browser stores this token in `localStorage` and sends it back to prove they are authenticated securely.

---

## 3. Intelligence & Real-Time Engines
*The advanced APIs that make this project stand out.*

- **Google Gemini Generative AI:** Integrated via `@google/genai`. Instead of a standard chatbot, Gemini is used as a silent **Classification Engine**. It reads the user's plain-text complaint, analyzes the urgency, and returns a JSON object containing the exact Railway Department and a Priority Level (`High`, `Medium`, `Low`).
- **Nodemailer (SMTP):** Connects directly to Google's SMTP servers using an App Password. It is used to generate secure 6-digit OTPs and instantly email them to users for identity verification, and to send automated email alerts when an admin updates a ticket.
- **Socket.io (WebSockets):** Bypasses standard HTTP request/response rules. It opens a permanent, bi-directional tunnel between the backend and the Admin Dashboard. When a complaint is filed, the server pushes the data through the socket, updating the Admin's screen in real-time without them clicking "Refresh".

---

## 4. Cloud Deployment & Storage Infrastructure
*Where the code and data actually live on the public internet.*

- **Frontend Hosting (Vercel):** Your React code is deployed globally on Vercel's edge network. Vercel detects pushes to GitHub, compiles the Vite project into static HTML/JS, and serves it to users instantly.
- **Backend Hosting (Render):** Your Node.js server runs inside a **Docker Container** on Render's cloud servers. Render executes your `Dockerfile`, spins up a Linux container, and runs your API 24/7.
- **Permanent Database Storage (Aiven.io):** While Render handles your *code*, **Aiven.io** handles your *data*. Because Render's free tier is "ephemeral" (it destroys the server and builds a brand new one every time it wakes up from sleep), saving data on Render would result in permanent deletion of user complaints. By using Aiven.io, you created a permanent, highly secure, remote MySQL database cluster. Render opens a secure TCP connection across the internet to Aiven.io to write the SQL rows. Even if Render crashes or restarts, your data is 100% safe in Aiven.
- **Image Storage (Ephemeral Local Storage):** Currently, the images uploaded via Multer are saved directly to Render's local hard drive (`/uploads` folder). *Note: Because Render's free tier is ephemeral, the server deletes these images when it goes to sleep.* (In an enterprise environment, we would swap Multer to upload these to an Amazon S3 Bucket instead).

---
*Generated for the RailMadad Repository.*
