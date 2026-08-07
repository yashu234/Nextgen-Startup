const { errorResponse } = require('../utils/apiResponse')

/**
 * Validation Middleware Factory
 *
 * Returns an Express middleware that validates req.body against
 * a list of required field names.
 *
 * Usage:
 *   router.post('/signup', validateFields(['name', 'email', 'password']), authController.signup)
 *
 * @param {string[]} fields - Array of required field names
 */
const validateFields = (fields) => (req, res, next) => {
  const missing = fields.filter(
    (field) => req.body[field] === undefined || req.body[field] === ''
  )

  if (missing.length > 0) {
    return errorResponse(
      res,
      `Missing required fields: ${missing.join(', ')}`,
      400
    )
  }

  next()
}

/**
 * Email format validator middleware
 * Checks if req.body.email is a valid email address.
 */
const validateEmail = (req, res, next) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (req.body.email && !emailRegex.test(req.body.email)) {
    return errorResponse(res, 'Invalid email address format.', 400)
  }
  next()
}

/**
 * Password strength validator middleware
 * Ensures req.body.password is at least 6 characters.
 */
const validatePasswordLength = (req, res, next) => {
  if (req.body.password && req.body.password.length < 6) {
    return errorResponse(res, 'Password must be at least 6 characters long.', 400)
  }
  next()
}

module.exports = { validateFields, validateEmail, validatePasswordLength }
