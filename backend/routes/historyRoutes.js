const express = require('express')
const router = express.Router()

const {
  getHistory,
  getHistoryById,
  deleteHistory,
} = require('../controllers/historyController')

const { protect } = require('../middleware/authMiddleware')

/**
 * History Routes
 * Mounted at /api/history in app.js
 *
 * All routes are private — require a valid JWT.
 *
 * Matches frontend historyService.js exactly:
 *   historyService.getAll()      → GET    /api/history
 *   historyService.getById(id)   → GET    /api/history/:id
 *   historyService.remove(id)    → DELETE /api/history/:id
 */

router.get('/',     protect, getHistory)
router.get('/:id',  protect, getHistoryById)
router.delete('/:id', protect, deleteHistory)

module.exports = router
