# Startup Forge — Backend API Documentation

**Base URL (dev):** `http://localhost:5000/api`  
**Auth:** Pass JWT as `Authorization: Bearer <token>` header on protected routes.  
**All responses follow this shape:**
```json
// Success
{ "success": true, "message": "...", "data": { ... } }

// Error
{ "success": false, "message": "..." }
```

---

## 🔓 Auth Routes — `/api/auth`

### POST `/api/auth/signup`
Register a new user.

**Body:**
```json
{ "name": "Jaskaran Singh", "email": "jass@example.com", "password": "secret123" }
```
**Response `201`:**
```json
{ "success": true, "message": "Account created successfully.", "data": {
    "token": "<jwt>",
    "user": { "_id": "...", "name": "Jaskaran Singh", "email": "jass@example.com", "createdAt": "..." }
}}
```

---

### POST `/api/auth/login`
Login and receive a JWT token.

**Body:**
```json
{ "email": "jass@example.com", "password": "secret123" }
```
**Response `200`:**
```json
{ "success": true, "message": "Login successful.", "data": {
    "token": "<jwt>",
    "user": { "_id": "...", "name": "Jaskaran Singh", "email": "jass@example.com", "createdAt": "..." }
}}
```

---

### GET `/api/auth/me` 🔒
Get the currently authenticated user's profile.

**Response `200`:**
```json
{ "success": true, "data": { "user": { "_id": "...", "name": "...", "email": "...", "createdAt": "..." } } }
```

---

### PUT `/api/auth/me` 🔒
Update name or email.

**Body (any or both):**
```json
{ "name": "New Name", "email": "new@email.com" }
```

---

### PUT `/api/auth/change-password` 🔒
Change the authenticated user's password.

**Body:**
```json
{ "currentPassword": "secret123", "newPassword": "newSecret456" }
```

---

## 🚀 Startup Generation — `/api/generate`

### POST `/api/generate` (optional auth 🔓/🔒)
Generate a full AI-powered startup kit.  
If a valid JWT is provided, the kit is **saved to MongoDB**.

**Body:**
```json
{
  "idea": "An app that connects local farmers with urban buyers",
  "industry": "agriculture",
  "budget": "25k_100k",
  "businessType": "marketplace",
  "targetAudience": "b2c_general",
  "location": "India"
}
```
**Response `201`:**
```json
{ "success": true, "message": "Startup kit generated successfully.", "data": {
    "businessPlan": { "executiveSummary": "...", "problem": "...", "solution": "...", "marketAnalysis": "...", "revenueModel": "...", "growthStrategy": "...", "milestones": [...], "conclusion": "..." },
    "branding": { "name": "...", "tagline": "...", "mission": "...", "values": [...], "colors": { "primary": "#...", "secondary": "#...", "accent": "#..." }, "typography": "..." },
    "website": { "heroHeadline": "...", "heroSubtitle": "...", "features": [...], "cta": "...", "aboutSection": "..." },
    "marketing": { "channels": [...], "launchChecklist": [...], "keywords": [...], "adCampaigns": [...] },
    "finance": { "projections": [...], "unitEconomics": {...}, "breakEven": "...", "roi": "..." },
    "compliance": { "checklist": [...], "legalDocs": [...], "registrations": [...] },
    "pitchDeck": { "problem": "...", "solution": "...", "market": "...", "businessModel": "...", "traction": "...", "team": "...", "ask": "..." },
    "_projectId": "..."
}}
```

---

## 📋 History — `/api/history` 🔒

### GET `/api/history`
Get all saved startup projects for the logged-in user.

**Response `200`:**
```json
{ "success": true, "data": {
    "history": [...],
    "projects": [{ "_id": "...", "startupIdea": "...", "industry": "...", "budget": "...", "createdAt": "..." }]
}}
```

---

### GET `/api/history/:id`
Get a single project's full generated kit.  
Also increments the `downloadCount` for analytics.

**Response `200`:** Same shape as `/api/generate` response data.

---

### DELETE `/api/history/:id`
Delete a project and its history record.

**Response `200`:**
```json
{ "success": true, "message": "Project deleted from history successfully.", "data": {} }
```

---

## 👤 Profile — `/api/profile` 🔒

### GET `/api/profile`
Get user profile with total project count.

**Response `200`:**
```json
{ "success": true, "data": { "user": { "_id": "...", "name": "...", "email": "...", "createdAt": "...", "projectCount": 5 } } }
```

---

### PUT `/api/profile`
Update name or email.

**Body:** `{ "name": "...", "email": "..." }`

---

### DELETE `/api/profile`
Permanently delete the account and **all associated projects & history**.

**Response `200`:**
```json
{ "success": true, "message": "Account and all associated data deleted successfully.", "data": {} }
```

---

## ⚙️ Settings — `/api/settings` 🔒

### GET `/api/settings`
Get user preferences.

**Response `200`:**
```json
{ "success": true, "data": { "settings": { "appearance": "system", "notifications": { "email": true, "projectUpdates": true } } } }
```

---

### PUT `/api/settings`
Update user preferences.

**Body:**
```json
{ "appearance": "dark", "notifications": { "email": false, "projectUpdates": true } }
```

---

## 🏥 Health Check

### GET `/api/health`
Check if the server is running. No auth required.

**Response `200`:**
```json
{ "success": true, "message": "Startup Forge API is running 🚀", "environment": "development" }
```

---

## ❌ Error Reference

| Status | Meaning |
|--------|---------|
| `400` | Bad Request — missing/invalid fields |
| `401` | Unauthorized — invalid or missing JWT |
| `404` | Not Found — resource doesn't exist |
| `409` | Conflict — email already in use |
| `429` | Too Many Requests — rate limited |
| `500` | Internal Server Error |

---

## 🔐 Security Checklist
- ✅ Passwords hashed with `bcryptjs` (salt rounds: 10)
- ✅ JWTs signed with `JWT_SECRET`, expire in 30 days
- ✅ Helmet sets secure HTTP response headers
- ✅ CORS restricted to frontend origins only
- ✅ `password` field excluded from all DB queries by default (`select: false`)
- ✅ Auth middleware verifies JWT on every protected route
- ✅ Users can only access their own projects (userId scoped queries)
- ✅ `GEMINI_API_KEY` never exposed to the frontend
