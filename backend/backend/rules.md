# Rules & Guidelines (Backend)

## What to Use
- **Stack**: Node.js, Express.js, MongoDB Atlas, Mongoose.
- **Security**: JWT for authentication, bcrypt for password hashing, Helmet for HTTP headers, CORS.
- **Architecture**: Strict MVC (Model-View-Controller) pattern separation.
- **Async/Await**: Use modern asynchronous JavaScript. Avoid callback hell.
- **Response Format**: Always return consistent JSON structures.
  - Success: `{ "success": true, "message": "...", "data": {...} }`
  - Error: `{ "success": false, "message": "..." }`
- **Error Handling**: Use a global error handler middleware. Never allow the Node process to crash on unhandled rejections.

## What to Avoid
- **No Direct AI Calls from Frontend**: Do not expose AI API keys to the frontend. All Gemini interactions must route through the backend.
- **No Plaintext Passwords**: Never store or log user passwords in plaintext.
- **No Overengineering**: Do not introduce unnecessary libraries or complex architectural patterns unless strictly needed.
- **Do Not Modify Frontend Code**: Focus strictly on the backend API contracts.
- **Do Not Mix Concerns**: Controllers should not contain complex business logic; delegate to `services/`. Routes should only define endpoints and attach middleware/controllers.
