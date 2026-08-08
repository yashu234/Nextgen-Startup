const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

/**
 * User Schema
 *
 * Stores registered user accounts.
 * Passwords are NEVER stored as plaintext — bcrypt hashing
 * happens via the pre-save hook below.
 *
 * Fields
 *   name        - Display name of the user
 *   email       - Unique email address (used for login)
 *   password    - bcrypt-hashed password (never exposed in API responses)
 *   createdAt   - Auto-managed by Mongoose timestamps
 *   updatedAt   - Auto-managed by Mongoose timestamps
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      // Never return the password field in any query result by default
      select: false,
    },

    // User preferences — managed by settingsService.js on the frontend
    settings: {
      appearance: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'system',
      },
      notifications: {
        email:          { type: Boolean, default: true },
        projectUpdates: { type: Boolean, default: true },
      },
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
)

// ─── Pre-Save Hook: Hash Password ─────────────────────────────────────────────
// Runs before every .save() call.
// Only re-hashes if the password field was actually modified —
// prevents re-hashing on profile updates that don't touch password.
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// ─── Instance Method: Compare Passwords ───────────────────────────────────────
// Used in authController.login to verify submitted password
// against the stored bcrypt hash.
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// ─── Instance Method: Safe Public Profile ─────────────────────────────────────
// Returns only the fields safe to send to the frontend.
// Never includes the hashed password.
userSchema.methods.toPublicJSON = function () {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    createdAt: this.createdAt,
  }
}

const User = mongoose.model('User', userSchema)

module.exports = User
