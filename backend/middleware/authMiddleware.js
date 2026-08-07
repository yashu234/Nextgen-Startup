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
    // Extract Bearer token from the Authorization header
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Not authorised. No token provided.', 401)
    }

    const token = authHeader.split(' ')[1]

    // Verify the token — throws if expired or tampered
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

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
