/**
 * Utility: Consistent API Response Helpers
 *
 * Every API response follows the same shape so the frontend
 * can always rely on `success`, `message`, and `data` fields.
 *
 * Success shape:
 *   { success: true, message: "...", data: {...} }
 *
 * Error shape:
 *   { success: false, message: "..." }
 */

/**
 * Send a successful JSON response.
 * @param {import('express').Response} res
 * @param {string} message   - Human-readable success message
 * @param {object} [data={}] - Payload to return
 * @param {number} [statusCode=200]
 */
const successResponse = (res, message, data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  })
}

/**
 * Send an error JSON response.
 * @param {import('express').Response} res
 * @param {string} message         - Human-readable error message
 * @param {number} [statusCode=500]
 * @param {object} [errors=null]   - Optional field-level validation errors
 */
const errorResponse = (res, message, statusCode = 500, errors = null) => {
  const body = { success: false, message }
  if (errors) body.errors = errors
  return res.status(statusCode).json(body)
}

module.exports = { successResponse, errorResponse }
