const mongoose = require('mongoose')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const { generateAccessToken, generateRefreshToken, setTokenCookies, clearTokenCookies } = require('../utils/generateToken')
const { successResponse, errorResponse } = require('../utils/apiResponse')

/**
 * Auth Controller
 *
 * Handles user registration, authentication, and profile management.
 * Supports both connected MongoDB database and an in-memory dev store
 * when running without a live local MongoDB service.
 */

// Development in-memory user store when MongoDB is offline
const devUserStore = new Map()

const isDbConnected = () => mongoose.connection.readyState === 1

// ─────────────────────────────────────────────────────────────────────────────
// @route   POST /api/auth/signup
// @access  Public
// @desc    Register a new user account
// ─────────────────────────────────────────────────────────────────────────────
const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return errorResponse(res, 'Name, email, and password are required fields.', 400)
    }

    const normalizedEmail = email.toLowerCase().trim()

    if (isDbConnected()) {
      const existingUser = await User.findOne({ email: normalizedEmail })
      if (existingUser) {
        return errorResponse(res, 'An account with this email already exists.', 409)
      }

      const user = await User.create({ name: name.trim(), email: normalizedEmail, password })
      const accessToken = generateAccessToken(user._id)
      const refreshToken = generateRefreshToken(user._id)
      setTokenCookies(res, accessToken, refreshToken)

      return successResponse(
        res,
        'Account created successfully.',
        { user: user.toPublicJSON() },
        201
      )
    } else {
      if (devUserStore.has(normalizedEmail)) {
        return errorResponse(res, 'An account with this email already exists.', 409)
      }

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)
      const devId = 'dev_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7)
      const devUser = {
        _id: devId,
        id: devId,
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
        toPublicJSON() {
          return { _id: this._id, id: this._id, name: this.name, email: this.email, createdAt: this.createdAt }
        }
      }
      devUserStore.set(normalizedEmail, devUser)

      const accessToken = generateAccessToken(devUser._id)
      const refreshToken = generateRefreshToken(devUser._id)
      setTokenCookies(res, accessToken, refreshToken)

      return successResponse(
        res,
        'Account created successfully.',
        { user: devUser.toPublicJSON() },
        201
      )
    }
  } catch (error) {
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

    if (!email || !password) {
      return errorResponse(res, 'Email and password are required fields.', 400)
    }

    const normalizedEmail = email.toLowerCase().trim()

    if (isDbConnected()) {
      const user = await User.findOne({ email: normalizedEmail }).select('+password')

      if (!user) {
        return errorResponse(res, 'Invalid email or password.', 401)
      }

      const isMatch = await user.matchPassword(password)
      if (!isMatch) {
        return errorResponse(res, 'Invalid email or password.', 401)
      }

      const accessToken = generateAccessToken(user._id)
      const refreshToken = generateRefreshToken(user._id)
      setTokenCookies(res, accessToken, refreshToken)

      return successResponse(
        res,
        'Login successful.',
        { user: user.toPublicJSON() },
        200
      )
    } else {
      const devUser = devUserStore.get(normalizedEmail)
      if (!devUser) {
        return errorResponse(res, 'Invalid email or password.', 401)
      }

      const isMatch = await bcrypt.compare(password, devUser.password)
      if (!isMatch) {
        return errorResponse(res, 'Invalid email or password.', 401)
      }

      const accessToken = generateAccessToken(devUser._id)
      const refreshToken = generateRefreshToken(devUser._id)
      setTokenCookies(res, accessToken, refreshToken)

      return successResponse(
        res,
        'Login successful.',
        { user: devUser.toPublicJSON() },
        200
      )
    }
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
    if (isDbConnected()) {
      const user = await User.findById(req.user.id)

      if (!user) {
        return errorResponse(res, 'User not found.', 404)
      }

      return successResponse(res, 'Profile fetched successfully.', {
        user: user.toPublicJSON(),
      })
    } else {
      let foundUser = null
      for (const u of devUserStore.values()) {
        if (u._id === req.user.id || u.id === req.user.id) {
          foundUser = u
          break
        }
      }

      if (!foundUser) {
        foundUser = {
          _id: req.user.id,
          id: req.user.id,
          name: 'Developer User',
          email: 'dev@startupforge.io',
          createdAt: new Date().toISOString(),
          toPublicJSON() {
            return { _id: this._id, id: this._id, name: this.name, email: this.email, createdAt: this.createdAt }
          }
        }
      }

      return successResponse(res, 'Profile fetched successfully.', {
        user: foundUser.toPublicJSON(),
      })
    }
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

    const allowedUpdates = {}
    if (name) allowedUpdates.name = name.trim()
    if (email) allowedUpdates.email = email.toLowerCase().trim()

    if (isDbConnected()) {
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
    } else {
      let foundUser = null
      for (const u of devUserStore.values()) {
        if (u._id === req.user.id || u.id === req.user.id) {
          foundUser = u
          break
        }
      }

      if (foundUser) {
        if (allowedUpdates.name) foundUser.name = allowedUpdates.name
        if (allowedUpdates.email) foundUser.email = allowedUpdates.email
        return successResponse(res, 'Profile updated successfully.', {
          user: foundUser.toPublicJSON(),
        })
      }

      return errorResponse(res, 'User not found.', 404)
    }
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

    if (isDbConnected()) {
      const user = await User.findById(req.user.id).select('+password')

      if (!user) {
        return errorResponse(res, 'User not found.', 404)
      }

      const isMatch = await user.matchPassword(currentPassword)
      if (!isMatch) {
        return errorResponse(res, 'Current password is incorrect.', 401)
      }

      user.password = newPassword
      await user.save()

      return successResponse(res, 'Password changed successfully.')
    } else {
      let foundUser = null
      for (const u of devUserStore.values()) {
        if (u._id === req.user.id || u.id === req.user.id) {
          foundUser = u
          break
        }
      }

      if (!foundUser) {
        return errorResponse(res, 'User not found.', 404)
      }

      const isMatch = await bcrypt.compare(currentPassword, foundUser.password)
      if (!isMatch) {
        return errorResponse(res, 'Current password is incorrect.', 401)
      }

      const salt = await bcrypt.genSalt(10)
      foundUser.password = await bcrypt.hash(newPassword, salt)

      return successResponse(res, 'Password changed successfully.')
    }
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// @route   POST /api/auth/logout
// @access  Public
// @desc    Clear cookies to logout user
// ─────────────────────────────────────────────────────────────────────────────
const logout = async (req, res, next) => {
  try {
    clearTokenCookies(res)
    return successResponse(res, 'Logged out successfully.')
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/auth/refresh
// @access  Public (requires valid refreshToken cookie)
// @desc    Issue a new access token
// ─────────────────────────────────────────────────────────────────────────────
const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken
    if (!refreshToken) {
      return errorResponse(res, 'No refresh token provided', 401)
    }

    const jwt = require('jsonwebtoken')
    const secret = process.env.JWT_SECRET || 'dev_secret_key_nextgen_startup_12345'
    jwt.verify(refreshToken, secret, async (err, decoded) => {
      if (err) {
        return errorResponse(res, 'Invalid or expired refresh token', 401)
      }

      const accessToken = generateAccessToken(decoded.id)
      const isProd = process.env.NODE_ENV === 'production'
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: 15 * 60 * 1000
      })

      return successResponse(res, 'Token refreshed successfully')
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { signup, login, getMe, updateMe, changePassword, logout, refresh }
