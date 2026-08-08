const express = require('express')
const router = express.Router()

const {
  generateStartup,
  getHistory,
  getProjectById,
  deleteProject,
} = require('../controllers/startupController')

const { protect } = require('../middleware/authMiddleware')
const { validateFields } = require('../middleware/validateMiddleware')

/**
 * Startup Routes
 *
 * Mounted at TWO paths in app.js to satisfy both:
 *   - Frontend constant: GENERATE = '/generate'  → /api/generate
 *   - Architecture spec: POST /api/startup/generate
 *
 * POST   /generate  (mounted at /api/generate in app.js) — Public + optional auth
 * GET    /history                                         — Private
 * GET    /:id                                             — Private
 * DELETE /:id                                             — Private
 *
 * Note: `protect` is used as OPTIONAL middleware on the generate route —
 * if a token is present it saves to DB, otherwise it just returns the kit.
 */

// ── Optional auth helper ───────────────────────────────────────────────────
// Does not reject unauthenticated users — just attaches req.user if valid
const optionalAuth = (req, res, next) => {
  let token = req.cookies?.accessToken
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1]
  }
  if (!token) return next()

  const jwt = require('jsonwebtoken')
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
  } catch {
    // Invalid token — treat as unauthenticated, don't block the request
  }
  next()
}

// ── Generate Startup Kit (works for both authenticated and guest users) ────
router.post(
  '/',
  optionalAuth,
  validateFields(['idea', 'industry', 'budget']),
  generateStartup
)

// ── Protected History Routes ───────────────────────────────────────────────
router.get('/history', protect, getHistory)
router.get('/:id', protect, getProjectById)
router.delete('/:id', protect, deleteProject)

module.exports = router
