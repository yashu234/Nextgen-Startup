const jwt = require('jsonwebtoken')

/**
 * Generate a signed JWT token for a given user ID.
 *
 * @param {string} userId - The MongoDB `_id` of the user
 * @returns {string}      - Signed JWT token
 *
 * The token is signed with JWT_SECRET and expires per JWT_EXPIRE
 * (defaults to 30 days if the env variable is missing).
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  )
}

module.exports = generateToken
