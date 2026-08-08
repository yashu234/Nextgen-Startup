const mongoose = require('mongoose')

/**
 * StartupProject Schema
 *
 * Stores every generated startup kit alongside the input
 * form data that produced it.
 *
 * The `generatedResult` field holds the full AI-produced JSON kit
 * (businessPlan, branding, website, marketing, finance, compliance,
 * pitchDeck) as a flexible Mixed type — structure is defined and
 * owned by Member 3's AI service.
 *
 * This model is the single source of truth for all generated kits.
 * History records reference this model via startupId.
 */
const startupProjectSchema = new mongoose.Schema(
  {
    // Reference to the user who created this project (accepts ObjectId or dev String IDs)
    userId: {
      type: mongoose.Schema.Types.Mixed,
      ref: 'User',
      required: true,
      index: true, // optimise lookup by user
    },

    // ── Input Fields (from the frontend StartupForm) ────────────────────────
    startupIdea: {
      type: String,
      required: [true, 'Startup idea is required'],
      trim: true,
      maxlength: [2000, 'Startup idea cannot exceed 2000 characters'],
    },
    industry: {
      type: String,
      required: [true, 'Industry is required'],
      trim: true,
    },
    budget: {
      type: String,
      required: [true, 'Budget range is required'],
      trim: true,
    },
    businessType: {
      type: String,
      trim: true,
      default: '',
    },
    targetAudience: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },

    // ── AI-Generated Output ─────────────────────────────────────────────────
    // Stored as Mixed so Member 3 can evolve the structure freely.
    // The frontend reads: result.businessPlan, result.branding,
    // result.website, result.marketing, result.finance,
    // result.compliance, result.pitchDeck
    generatedResult: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
  }
)

const StartupProject = mongoose.model('StartupProject', startupProjectSchema)

module.exports = StartupProject
