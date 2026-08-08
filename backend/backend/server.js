// Load environment variables FIRST — before any other module reads process.env
require('dotenv').config()

const app = require('./app')
const connectDB = require('./config/db')

const PORT = process.env.PORT || 5000

// ─── Boot Sequence ─────────────────────────────────────────────────────────────
const startServer = async () => {
  // 1. Connect to MongoDB — exits process on failure (fail-fast)
  await connectDB()

  // 2. Start the HTTP server
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
    console.log(`📡 API Base URL: http://localhost:${PORT}/api`)
  })

  // ─── Graceful Shutdown ──────────────────────────────────────────────────────
  // Close connections cleanly when the process receives a shutdown signal.
  // This prevents database connections from being left hanging.
  const gracefulShutdown = (signal) => {
    console.log(`\n⚠️  ${signal} received. Shutting down gracefully...`)
    server.close(async () => {
      console.log('🔌 HTTP server closed.')
      const mongoose = require('mongoose')
      await mongoose.connection.close()
      console.log('🗃️  MongoDB connection closed.')
      process.exit(0)
    })
  }

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
  process.on('SIGINT',  () => gracefulShutdown('SIGINT'))

  // ─── Unhandled Promise Rejection Guard ─────────────────────────────────────
  // Prevents silent failures from unhandled async errors
  process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason)
    server.close(() => process.exit(1))
  })
}

startServer()
