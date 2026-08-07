const express = require('express')
const router = express.Router()

const { getSettings, updateSettings } = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

/**
 * Settings Routes — mounted at /api/settings in app.js
 *
 * Matches frontend settingsService.js exactly:
 *   settingsService.getSettings()      → GET /api/settings
 *   settingsService.updateSettings()   → PUT /api/settings
 */
router.get('/', protect, getSettings)
router.put('/', protect, updateSettings)

module.exports = router
