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
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) return next()

  const jwt = require('jsonwebtoken')
  try {
    const token = authHeader.split(' ')[1]
    req.user = jwt.verify(token, process.env.JWT_SECRET)
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
