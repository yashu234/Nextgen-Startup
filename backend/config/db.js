const mongoose = require('mongoose')

/**
 * Connect to MongoDB Atlas using Mongoose.
 * Reads connection URI from process.env.MONGO_URI.
 * Exits the process if connection fails (fail-fast on startup).
 */
const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/startupforge'
    const conn = await mongoose.connect(uri)
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.warn(`⚠️ MongoDB Connection Warning: ${error.message}`)
    console.warn(`👉 Provide a valid MONGO_URI in backend/.env to connect to MongoDB.`)
  }
}

module.exports = connectDB
