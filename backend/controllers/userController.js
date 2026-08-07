const User = require('../models/User')
const StartupProject = require('../models/StartupProject')
const { successResponse, errorResponse } = require('../utils/apiResponse')

/**
 * User Controller — Profile Management
 *
 * Handles all user-facing profile operations.
 * All routes here are protected (require JWT via `protect` middleware).
 *
 * Note: getMe, updateMe, and changePassword are already handled in
 * authController and mounted at /api/auth/me. This controller provides
 * the /api/profile alias routes (same logic, different mount path)
 * plus the account deletion endpoint.
 *
 * Frontend services that call these:
 *   profileService.getProfile()    → GET  /api/auth/me  (already live)
 *   profileService.updateProfile() → PUT  /api/auth/me  (already live)
 *   settingsService.getSettings()  → GET  /api/settings
 *   settingsService.updateSettings()→ PUT  /api/settings
 */

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/profile
// @access  Private
// @desc    Get logged-in user profile + project count summary
// ─────────────────────────────────────────────────────────────────────────────
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) return errorResponse(res, 'User not found.', 404)

    // Include project count so the dashboard can show stats without a separate call
    const projectCount = await StartupProject.countDocuments({ userId: req.user.id })

    return successResponse(res, 'Profile fetched successfully.', {
      user: {
        ...user.toPublicJSON(),
        projectCount,
      },
    })
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// @route   PUT /api/profile
// @access  Private
// @desc    Update logged-in user's name or email
// ─────────────────────────────────────────────────────────────────────────────
const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body

    const allowedUpdates = {}
    if (name)  allowedUpdates.name  = name.trim()
    if (email) allowedUpdates.email = email.toLowerCase().trim()

    if (Object.keys(allowedUpdates).length === 0) {
      return errorResponse(res, 'No valid fields provided for update.', 400)
    }

    // Check new email is not already taken by another user
    if (allowedUpdates.email) {
      const taken = await User.findOne({ email: allowedUpdates.email })
      if (taken && taken._id.toString() !== req.user.id) {
        return errorResponse(res, 'This email is already in use by another account.', 409)
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      allowedUpdates,
      { new: true, runValidators: true }
    )

    if (!user) return errorResponse(res, 'User not found.', 404)

    return successResponse(res, 'Profile updated successfully.', {
      user: user.toPublicJSON(),
    })
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// @route   DELETE /api/profile
// @access  Private
// @desc    Permanently delete user account and all their data
// ─────────────────────────────────────────────────────────────────────────────
const deleteAccount = async (req, res, next) => {
  try {
    const History = require('../models/History')

    // Delete all user's startup projects and history records (cascade)
    await StartupProject.deleteMany({ userId: req.user.id })
    await History.deleteMany({ userId: req.user.id })
    await User.findByIdAndDelete(req.user.id)

    return successResponse(res, 'Account and all associated data deleted successfully.')
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/settings
// @access  Private
// @desc    Get user settings (stored in User document as preferences)
// ─────────────────────────────────────────────────────────────────────────────
const getSettings = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) return errorResponse(res, 'User not found.', 404)

    // Return settings with sensible defaults if not yet saved
    const settings = user.settings || {
      appearance: 'system',
      notifications: { email: true, projectUpdates: true },
    }

    return successResponse(res, 'Settings fetched successfully.', { settings })
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// @route   PUT /api/settings
// @access  Private
// @desc    Update user settings preferences
// ─────────────────────────────────────────────────────────────────────────────
const updateSettings = async (req, res, next) => {
  try {
    const { appearance, notifications } = req.body

    const settingsUpdate = {}
    if (appearance)    settingsUpdate['settings.appearance']    = appearance
    if (notifications) settingsUpdate['settings.notifications'] = notifications

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: settingsUpdate },
      { new: true, runValidators: true }
    )

    if (!user) return errorResponse(res, 'User not found.', 404)

    return successResponse(res, 'Settings updated successfully.', {
      settings: user.settings || {},
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getProfile,
  updateProfile,
  deleteAccount,
  getSettings,
  updateSettings,
}
