const jwt = require('jsonwebtoken')
const { errorResponse } = require('../utils/apiResponse')

/**
 * Authentication Middleware
 *
 * Protects private routes by:
 *   1. Reading the "Authorization: Bearer <token>" header.
 *   2. Verifying the token signature with JWT_SECRET.
 *   3. Attaching the decoded user payload to req.user so downstream
 *      controllers can access the authenticated user's ID.
 *
 * Usage:
 *   router.get('/profile', protect, userController.getProfile)
 */
const protect = async (req, res, next) => {
  try {
    // Extract token from cookies first, fallback to Authorization header
    let token = req.cookies?.accessToken

    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return errorResponse(res, 'Not authorised. No token provided.', 401)
    }

    // Verify the token — throws if expired or tampered
    const secret = process.env.JWT_SECRET || 'dev_secret_key_nextgen_startup_12345'
    const decoded = jwt.verify(token, secret)

    // Attach decoded payload (contains { id, iat, exp }) to the request
    req.user = decoded

    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Session expired. Please log in again.', 401)
    }
    return errorResponse(res, 'Not authorised. Invalid token.', 401)
  }
}

module.exports = { protect }
