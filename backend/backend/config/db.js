const mongoose = require('mongoose')

/**
 * Connect to MongoDB Atlas using Mongoose.
 * Reads connection URI from process.env.MONGO_URI.
 * Exits the process if connection fails (fail-fast on startup).
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`)
    // Exit with failure so the process manager (nodemon/PM2) can restart cleanly
    process.exit(1)
  }
}

module.exports = connectDB
