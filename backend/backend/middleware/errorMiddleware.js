/**
 * Global Error Handler Middleware
 *
 * Must be registered LAST in app.js (after all routes).
 * Catches any error passed via next(err) and returns a
 * consistent JSON error shape to the client.
 *
 * Shape:
 *   { success: false, message: "...", stack: "..." (dev only) }
 */
const errorHandler = (err, req, res, next) => {
  // Default to 500 if no status code has been set
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500

  console.error(`[ERROR] ${err.message}`)

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    // Only expose stack trace in development — never in production
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

/**
 * 404 Not Found Handler
 *
 * Catches any request that doesn't match a registered route.
 * Must be registered BEFORE the global error handler.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`)
  res.status(404)
  next(error)
}

module.exports = { errorHandler, notFound }
