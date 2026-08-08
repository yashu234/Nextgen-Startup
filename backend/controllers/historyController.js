const StartupProject = require('../models/StartupProject')
const History = require('../models/History')
const { successResponse, errorResponse } = require('../utils/apiResponse')

/**
 * History Controller
 *
 * Manages the user's saved startup project history.
 * Frontend calls these via historyService.js using:
 *   GET    /api/history       → historyService.getAll()
 *   GET    /api/history/:id   → historyService.getById(id)
 *   DELETE /api/history/:id   → historyService.remove(id)
 *
 * Each history record references a StartupProject.
 * On GET /:id we also increment the downloadCount for analytics
 * (Member 4 uses this for usage reporting).
 */

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/history
// @access  Private
// @desc    Get all history records for the logged-in user (list view)
// ─────────────────────────────────────────────────────────────────────────────
const getHistory = async (req, res, next) => {
  try {
    // Fetch all projects — include generatedResult so branding.name and
    // businessPlan.executiveSummary are available for the History page cards
    const projects = await StartupProject.find({ userId: req.user.id })
      .sort({ createdAt: -1 })

    // Shape each item to exactly what the History page renders:
    //   item._id, item.idea, item.industry, item.businessType,
    //   item.createdAt, item.branding?.name, item.businessPlan?.executiveSummary
    const historyItems = projects.map((p) => ({
      _id:          p._id,
      idea:         p.startupIdea,
      industry:     p.industry,
      budget:       p.budget,
      businessType: p.businessType,
      location:     p.location,
      createdAt:    p.createdAt,
      // Expose the top-level AI kit keys the History cards read
      branding:     p.generatedResult?.branding     || null,
      businessPlan: p.generatedResult?.businessPlan || null,
    }))

    return successResponse(res, 'History fetched successfully.', historyItems)
  } catch (error) {
    next(error)
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/history/:id
// @access  Private
// @desc    Get a single project's full kit by project ID
//          Increments downloadCount for analytics tracking
// ─────────────────────────────────────────────────────────────────────────────
const getHistoryById = async (req, res, next) => {
  try {
    const project = await StartupProject.findOne({
      _id: req.params.id,
      userId: req.user.id,
    })

    if (!project) {
      return errorResponse(res, 'Project not found.', 404)
    }

    // Upsert history record and increment download counter (analytics for Member 4)
    await History.findOneAndUpdate(
      { userId: req.user.id, startupId: project._id },
      { $inc: { downloadCount: 1 } },
      { upsert: true, new: true }
    )

    // IMPORTANT: Frontend History page does:
    //   const item = await historyService.getById(id)  → item = response.data (axios body)
    //   setResult(item)                                → item is stored as `result`
    //   result?.businessPlan                           → reads directly from item
    //
    // So we must return the kit keys at the TOP LEVEL of the response body,
    // NOT nested under `data`. We bypass successResponse here intentionally.
    return res.status(200).json({
      ...project.generatedResult,
      _projectId:   project._id,
      _idea:        project.startupIdea,
      _industry:    project.industry,
      _budget:      project.budget,
      _businessType: project.businessType,
      _createdAt:   project.createdAt,
    })
  } catch (error) {
    next(error)
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// @route   DELETE /api/history/:id
// @access  Private
// @desc    Delete a project and its history record
// ─────────────────────────────────────────────────────────────────────────────
const deleteHistory = async (req, res, next) => {
  try {
    const project = await StartupProject.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    })

    if (!project) {
      return errorResponse(res, 'Project not found or already deleted.', 404)
    }

    // Also remove the associated history record
    await History.findOneAndDelete({
      userId: req.user.id,
      startupId: req.params.id,
    })

    return successResponse(res, 'Project deleted from history successfully.')
  } catch (error) {
    next(error)
  }
}

module.exports = { getHistory, getHistoryById, deleteHistory }
