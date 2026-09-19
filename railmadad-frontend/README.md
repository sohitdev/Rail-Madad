# RailMadad - Frontend

This is the frontend client for the RailMadad Grievance Management System.

## Tech Stack
- **React 18** (UI Library)
- **Vite** (Build Tool)
- **Tailwind CSS v4** (Styling)
- **React Router v6** (Client-side Routing)
- **Socket.io-client** (Real-time updates)
- **Axios** (API Requests)

## Key Features
- **Anti-Slop Design:** Adheres to premium UI/UX standards, using bento-grid layouts, sparse typography, and minimal color palettes.
- **Multipart Form Uploads:** Seamlessly handles image uploads directly to the backend.
- **Live Socket Feeds:** The `AdminDashboardPage` subscribes to real-time WebSocket events to update the ticket list instantly without polling.
- **Axios Interceptors:** Automatically attaches JWT tokens to outgoing requests for protected admin routes.

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set Environment Variables:
   If running locally against the Node server, Vite automatically uses `http://localhost:3000`. If deploying, set the variable in your hosting provider:
   ```env
   VITE_API_URL=https://your-live-backend-url.com
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```

*For complete project documentation, see the [Root README](../README.md).*
