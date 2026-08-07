const jwt = require('jsonwebtoken')

const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '15m' })
}

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

const setTokenCookies = (res, accessToken, refreshToken) => {
  const isProd = process.env.NODE_ENV === 'production'
  const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
  }
  
  res.cookie('accessToken', accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000 // 15 minutes
  })

  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  })
}

const clearTokenCookies = (res) => {
  const isProd = process.env.NODE_ENV === 'production'
  const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
  }
  res.cookie('accessToken', '', { ...cookieOptions, maxAge: 0 })
  res.cookie('refreshToken', '', { ...cookieOptions, maxAge: 0 })
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  setTokenCookies,
  clearTokenCookies
}
