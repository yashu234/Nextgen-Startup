const User = require('../models/User')
const generateToken = require('../utils/generateToken')
const { successResponse, errorResponse } = require('../utils/apiResponse')

/**
 * Auth Controller
 *
 * Handles user registration and login.
 * All password operations are delegated to the User model
 * (bcrypt pre-save hook & matchPassword method).
 *
 * Response shape expected by the frontend AuthContext:
 *   { success: true, data: { token, user: { _id, name, email, createdAt } } }
 */

// ─────────────────────────────────────────────────────────────────────────────
// @route   POST /api/auth/signup
// @access  Public
// @desc    Register a new user account
// ─────────────────────────────────────────────────────────────────────────────
const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    // Check if a user with this email already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return errorResponse(res, 'An account with this email already exists.', 409)
    }

    // Create and save user — password is hashed by the pre-save hook in User model
    const user = await User.create({ name, email, password })

    // Generate JWT token for immediate login after signup
    const token = generateToken(user._id)

    return successResponse(
      res,
      'Account created successfully.',
      {
        token,
        user: user.toPublicJSON(),
      },
      201
    )
  } catch (error) {
    // Pass to global error handler (errorMiddleware.js)
    next(error)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// @route   POST /api/auth/login
// @access  Public
// @desc    Authenticate user and return JWT token
// ─────────────────────────────────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Explicitly select password since schema has `select: false`
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      // Generic message — do not reveal whether email exists or not (security best practice)
      return errorResponse(res, 'Invalid email or password.', 401)
    }

    // Compare submitted password against stored bcrypt hash
    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return errorResponse(res, 'Invalid email or password.', 401)
    }

    // Generate JWT token
    const token = generateToken(user._id)

    return successResponse(
      res,
      'Login successful.',
      {
        token,
        user: user.toPublicJSON(),
      },
      200
    )
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/auth/me
// @access  Private (requires JWT via protect middleware)
// @desc    Return the currently authenticated user's profile
// ─────────────────────────────────────────────────────────────────────────────
const getMe = async (req, res, next) => {
  try {
    // req.user.id is attached by authMiddleware.protect
    const user = await User.findById(req.user.id)

    if (!user) {
      return errorResponse(res, 'User not found.', 404)
    }

    return successResponse(res, 'Profile fetched successfully.', {
      user: user.toPublicJSON(),
    })
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// @route   PUT /api/auth/me
// @access  Private
// @desc    Update logged-in user's name or email
// ─────────────────────────────────────────────────────────────────────────────
const updateMe = async (req, res, next) => {
  try {
    const { name, email } = req.body

    // Only allow updating name and email through this route
    const allowedUpdates = {}
    if (name) allowedUpdates.name = name.trim()
    if (email) allowedUpdates.email = email.toLowerCase().trim()

    // Check if the new email is already taken by another user
    if (allowedUpdates.email) {
      const emailTaken = await User.findOne({ email: allowedUpdates.email })
      if (emailTaken && emailTaken._id.toString() !== req.user.id) {
        return errorResponse(res, 'This email is already in use by another account.', 409)
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      allowedUpdates,
      { new: true, runValidators: true }
    )

    if (!user) {
      return errorResponse(res, 'User not found.', 404)
    }

    return successResponse(res, 'Profile updated successfully.', {
      user: user.toPublicJSON(),
    })
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// @route   PUT /api/auth/change-password
// @access  Private
// @desc    Change logged-in user's password
// ─────────────────────────────────────────────────────────────────────────────
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return errorResponse(res, 'Both currentPassword and newPassword are required.', 400)
    }

    if (newPassword.length < 6) {
      return errorResponse(res, 'New password must be at least 6 characters.', 400)
    }

    // Retrieve user with password field (excluded by default)
    const user = await User.findById(req.user.id).select('+password')

    if (!user) {
      return errorResponse(res, 'User not found.', 404)
    }

    // Verify the current password is correct
    const isMatch = await user.matchPassword(currentPassword)
    if (!isMatch) {
      return errorResponse(res, 'Current password is incorrect.', 401)
    }

    // Assign new password — pre-save hook will hash it automatically
    user.password = newPassword
    await user.save()

    return successResponse(res, 'Password changed successfully.')
  } catch (error) {
    next(error)
  }
}

module.exports = { signup, login, getMe, updateMe, changePassword }
