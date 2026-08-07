const express = require('express')
const router = express.Router()

const {
  signup,
  login,
  getMe,
  updateMe,
  changePassword,
} = require('../controllers/authController')

const { protect } = require('../middleware/authMiddleware')
const {
  validateFields,
  validateEmail,
  validatePasswordLength,
} = require('../middleware/validateMiddleware')

/**
 * Auth Routes — mounted at /api/auth in app.js
 *
 * Public:
 *   POST   /api/auth/signup           → Register new user
 *   POST   /api/auth/login            → Login & receive JWT
 *
 * Protected (requires Bearer token):
 *   GET    /api/auth/me               → Get current user profile
 *   PUT    /api/auth/me               → Update name / email
 *   PUT    /api/auth/change-password  → Change password
 *
 * These endpoints match the frontend constants exactly:
 *   SIGNUP          → '/auth/signup'
 *   LOGIN           → '/auth/login'
 *   ME              → '/auth/me'
 *   CHANGE_PASSWORD → '/auth/change-password'
 */

// ── Public Routes ─────────────────────────────────────────────────────────────

router.post(
  '/signup',
  validateFields(['name', 'email', 'password']),
  validateEmail,
  validatePasswordLength,
  signup
)

router.post(
  '/login',
  validateFields(['email', 'password']),
  validateEmail,
  login
)

// ── Protected Routes ──────────────────────────────────────────────────────────

router.get('/me', protect, getMe)

router.put('/me', protect, updateMe)

router.put('/change-password', protect, changePassword)

module.exports = router
