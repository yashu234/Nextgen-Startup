const mongoose = require('mongoose')

/**
 * History Schema
 *
 * Tracks every time a user views or downloads a generated startup project.
 * Acts as a lightweight audit/activity log linked to StartupProject.
 *
 * Relationship:
 *   User (1) → History (many) → StartupProject (1)
 *
 * This model is separate from StartupProject so that download counts
 * and access timestamps can be updated without touching the heavy
 * generatedResult payload.
 *
 * Member 4 (Finance/Reports) uses this model to track download metrics
 * and generate usage analytics.
 */
const historySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    startupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StartupProject',
      required: true,
    },

    // Number of times the user has downloaded/exported this project
    downloadCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true, // createdAt = first access, updatedAt = last access/download
  }
)

// Compound index: one history record per user per project
historySchema.index({ userId: 1, startupId: 1 }, { unique: true })

const History = mongoose.model('History', historySchema)

module.exports = History
