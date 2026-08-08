/**
 * Finance Routes — Member 4: Finance, Compliance & Reporting
 *
 * Route Prefix: /api/finance
 *
 * Endpoints:
 *   POST /api/finance/calculate         → Server-side financial calculation
 *   POST /api/finance/save/:projectId   → Save finance model to a StartupProject
 *   GET  /api/finance/:projectId        → Get saved finance report for a project
 */

const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const {
  calculate,
  saveFinanceModel,
  getFinanceReport,
} = require('../controllers/financeController')

// All finance routes require authentication
router.use(protect)

// @route   POST /api/finance/calculate
// @desc    Run server-side financial calculations
router.post('/calculate', calculate)

// @route   POST /api/finance/save/:projectId
// @desc    Save a calculated finance model to an existing startup project
router.post('/save/:projectId', saveFinanceModel)

// @route   GET /api/finance/:projectId
// @desc    Retrieve the saved finance report for a startup project
router.get('/:projectId', getFinanceReport)

module.exports = router
