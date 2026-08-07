const StartupProject = require('../models/StartupProject')
const { generateStartupKit } = require('../services/aiService')
const { successResponse, errorResponse } = require('../utils/apiResponse')

/**
 * Startup Controller
 *
 * Handles the core business logic of Startup Forge:
 *   1. Receive validated form data from the frontend
 *   2. Call the AI service to generate the startup kit
 *   3. Persist the result in MongoDB
 *   4. Return the kit directly to the frontend
 *
 * Frontend flow (StartupContext.jsx):
 *   generateKit() → POST /api/generate → response.data stored as `result`
 *   The frontend reads: result.businessPlan, result.branding, etc.
 *   So we return the kit object directly in `data`.
 *
 * Works for both authenticated (saves to DB) and unauthenticated
 * (returns kit without saving) users.
 */

// ─────────────────────────────────────────────────────────────────────────────
// @route   POST /api/generate  (frontend alias)
//          POST /api/startup/generate
// @access  Public (logged-in users get DB persistence)
// @desc    Generate a full startup kit from form data
// ─────────────────────────────────────────────────────────────────────────────
const generateStartup = async (req, res, next) => {
  try {
    const { idea, industry, budget, businessType, targetAudience, location } = req.body

    // Basic required field guard (route-level validation also handles this)
    if (!idea || !industry || !budget) {
      return errorResponse(res, 'idea, industry, and budget are required fields.', 400)
    }

    const formData = { idea, industry, budget, businessType, targetAudience, location }

    // ── Step 1: Call AI Service ───────────────────────────────────────────
    const generatedResult = await generateStartupKit(formData)

    // ── Step 2: Persist if user is authenticated ──────────────────────────
    // req.user is attached by authMiddleware.protect (optional on this route)
    let savedProject = null
    if (req.user) {
      savedProject = await StartupProject.create({
        userId: req.user.id,
        startupIdea: idea,
        industry,
        budget,
        businessType: businessType || '',
        targetAudience: targetAudience || '',
        location: location || '',
        generatedResult,
      })
      console.log(`[Startup] Project saved to DB: ${savedProject._id}`)
    }

    // ── Step 3: Return kit to frontend ────────────────────────────────────
    // The frontend (StartupContext) stores the entire response.data as `result`
    // and reads result.businessPlan, result.branding, etc.
    return successResponse(
      res,
      'Startup kit generated successfully.',
      {
        ...generatedResult,
        // Optionally attach the project ID so frontend can link to history
        ...(savedProject && { _projectId: savedProject._id }),
      },
      201
    )
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/startup/history
//          GET /api/history
// @access  Private
// @desc    Get all startup projects for the logged-in user
// ─────────────────────────────────────────────────────────────────────────────
const getHistory = async (req, res, next) => {
  try {
    const projects = await StartupProject.find({ userId: req.user.id })
      .select('-generatedResult') // exclude heavy payload for list view
      .sort({ createdAt: -1 })

    return successResponse(res, 'History fetched successfully.', { projects })
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/startup/:id
//          GET /api/history/:id
// @access  Private
// @desc    Get a single startup project (full kit) by ID
// ─────────────────────────────────────────────────────────────────────────────
const getProjectById = async (req, res, next) => {
  try {
    const project = await StartupProject.findOne({
      _id: req.params.id,
      userId: req.user.id, // ensures users can only access their own projects
    })

    if (!project) {
      return errorResponse(res, 'Project not found.', 404)
    }

    // Return the full generatedResult so the frontend can restore the kit
    return successResponse(res, 'Project fetched successfully.', {
      ...project.generatedResult,
      _projectId: project._id,
    })
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// @route   DELETE /api/startup/:id
//          DELETE /api/history/:id
// @access  Private
// @desc    Delete a startup project by ID
// ─────────────────────────────────────────────────────────────────────────────
const deleteProject = async (req, res, next) => {
  try {
    const project = await StartupProject.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    })

    if (!project) {
      return errorResponse(res, 'Project not found or already deleted.', 404)
    }

    return successResponse(res, 'Project deleted successfully.')
  } catch (error) {
    next(error)
  }
}

module.exports = { generateStartup, getHistory, getProjectById, deleteProject }
