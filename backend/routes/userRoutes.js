const express = require('express')
const router = express.Router()

const {
  getProfile,
  updateProfile,
  deleteAccount,
} = require('../controllers/userController')

const { protect } = require('../middleware/authMiddleware')

/**
 * User / Profile Routes — mounted at /api/profile in app.js
 *
 * All routes are private — require a valid JWT.
 *
 *   GET    /api/profile  → Get profile + project count
 *   PUT    /api/profile  → Update name / email
 *   DELETE /api/profile  → Delete account (full cascade)
 *
 * Settings are handled by settingsRoutes.js at /api/settings.
 */

router.get('/',    protect, getProfile)
router.put('/',    protect, updateProfile)
router.delete('/', protect, deleteAccount)

module.exports = router
