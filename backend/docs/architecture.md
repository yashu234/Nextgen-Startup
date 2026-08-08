# Project Architecture & Flow

## High-Level Application Flow
The backend acts as the central communication hub. The frontend never communicates directly with the database or the AI engine.

`[Frontend (React/Vite)]` 
       │ (REST APIs via Axios)
       ▼
`[Backend (Node.js/Express) - Member 2]`
       │
   ┌───┴──────────────┐
   ▼                  ▼
`[MongoDB Atlas]`  `[AI Module - Member 3]`
   │
   ▼
`[Finance/Reports - Member 4]`

## Request Lifecycle (Example: Generate Startup)
1. Frontend sends `POST /api/startup/generate` with form data.
2. Backend receives request & validates input.
3. Backend calls AI Service (Member 3).
4. Backend receives AI response.
5. Backend stores generated project in MongoDB.
6. Backend returns structured JSON data to Frontend.

## Backend Folder Structure
```
backend/
├── config/         # Database and environment configurations
├── controllers/    # Route handlers (auth, startup, user, history)
├── middleware/     # Express middleware (auth, validation, errors)
├── models/         # Mongoose database schemas
├── routes/         # Express route definitions
├── services/       # External service integrations (AI, Email, etc.)
├── utils/          # Helper functions (token generation, responses)
├── validators/     # Input validation schemas
├── app.js          # Express app setup
└── server.js       # Server entry point
```
