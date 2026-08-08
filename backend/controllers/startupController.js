const mongoose = require('mongoose')
const StartupProject = require('../models/StartupProject')
const { generateStartupKit } = require('../services/aiService')
const { successResponse, errorResponse } = require('../utils/apiResponse')

/**
 * Startup Controller
 *
 * Handles core business logic for generating and managing startup kits.
 * Supports both connected MongoDB database and in-memory dev store
 * when running without a live local MongoDB service.
 */

const devProjectStore = new Map()
const isDbConnected = () => mongoose.connection.readyState === 1

// ─────────────────────────────────────────────────────────────────────────────
// @route   POST /api/generate  (frontend alias)
//          POST /api/startup/generate
// @access  Public (logged-in users get DB/store persistence)
// @desc    Generate a full startup kit from form data
// ─────────────────────────────────────────────────────────────────────────────
const generateStartup = async (req, res, next) => {
  try {
    const { idea, industry, budget, businessType, targetAudience, location } = req.body

    if (!idea || !industry || !budget) {
      return errorResponse(res, 'idea, industry, and budget are required fields.', 400)
    }

    const formData = { idea, industry, budget, businessType, targetAudience, location }

    // ── Step 1: Call AI Service ───────────────────────────────────────────
    const generatedResult = await generateStartupKit(formData)

    // ── Step 2: Persist if user is authenticated ──────────────────────────
    let savedProject = null
    if (req.user) {
      const userId = req.user.id || req.user._id
      if (isDbConnected()) {
        try {
          savedProject = await StartupProject.create({
            userId,
            startupIdea: idea,
            industry,
            budget,
            businessType: businessType || '',
            targetAudience: targetAudience || '',
            location: location || '',
            generatedResult,
          })
          console.log(`[Startup] Project saved to DB: ${savedProject._id}`)
        } catch (dbErr) {
          console.warn('[Startup] Could not save project to Mongo:', dbErr.message)
        }
      } else {
        const devProjId = 'local_' + Date.now()
        savedProject = {
          _id: devProjId,
          userId,
          startupIdea: idea,
          industry,
          budget,
          businessType: businessType || '',
          targetAudience: targetAudience || '',
          location: location || '',
          generatedResult,
          createdAt: new Date().toISOString(),
        }
        devProjectStore.set(devProjId, savedProject)
      }
    }

    // ── Step 3: Return kit to frontend ────────────────────────────────────
    return successResponse(
      res,
      'Startup kit generated successfully.',
      {
        ...generatedResult,
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
    const userId = req.user.id || req.user._id

    if (isDbConnected()) {
      const projects = await StartupProject.find({ userId })
        .select('-generatedResult')
        .sort({ createdAt: -1 })

      return successResponse(res, 'History fetched successfully.', { projects })
    } else {
      const projects = []
      for (const p of devProjectStore.values()) {
        if (p.userId === userId) {
          // Exclude generatedResult for list view
          // eslint-disable-next-ignore no-unused-vars
          const { generatedResult, ...rest } = p
          projects.push(rest)
        }
      }
      return successResponse(res, 'History fetched successfully.', { projects })
    }
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
    const userId = req.user.id || req.user._id

    if (isDbConnected()) {
      const project = await StartupProject.findOne({
        _id: req.params.id,
        userId,
      })

      if (!project) {
        return errorResponse(res, 'Project not found.', 404)
      }

      return successResponse(res, 'Project fetched successfully.', {
        ...project.generatedResult,
        _projectId: project._id,
      })
    } else {
      const project = devProjectStore.get(req.params.id)
      if (!project || project.userId !== userId) {
        return errorResponse(res, 'Project not found.', 404)
      }
      return successResponse(res, 'Project fetched successfully.', {
        ...project.generatedResult,
        _projectId: project._id,
      })
    }
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
    const userId = req.user.id || req.user._id

    if (isDbConnected()) {
      const project = await StartupProject.findOneAndDelete({
        _id: req.params.id,
        userId,
      })

      if (!project) {
        return errorResponse(res, 'Project not found or already deleted.', 404)
      }

      return successResponse(res, 'Project deleted successfully.')
    } else {
      const project = devProjectStore.get(req.params.id)
      if (!project || project.userId !== userId) {
        return errorResponse(res, 'Project not found or already deleted.', 404)
      }
      devProjectStore.delete(req.params.id)
      return successResponse(res, 'Project deleted successfully.')
    }
  } catch (error) {
    next(error)
  }
}

module.exports = { generateStartup, getHistory, getProjectById, deleteProject }
