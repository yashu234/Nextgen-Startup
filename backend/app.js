const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')

const rateLimit = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const cookieParser = require('cookie-parser')

const { notFound, errorHandler } = require('./middleware/errorMiddleware')

// ─── Route Imports ────────────────────────────────────────────────────────────
const authRoutes    = require('./routes/authRoutes')
const startupRoutes = require('./routes/startupRoutes')
const userRoutes    = require('./routes/userRoutes')
const historyRoutes = require('./routes/historyRoutes')
const settingsRoutes = require('./routes/settingsRoutes')
const financeRoutes  = require('./routes/financeRoutes')   // Member 4 ✅ — finance & reporting

const app = express()

// ─── Security Middleware ───────────────────────────────────────────────────────
// Helmet sets secure HTTP response headers (XSS protection, no-sniff, etc.)
app.use(helmet())

// CORS — allow requests from the React frontend dev server (any localhost port) and production domain
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean)

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, postman)
      if (!origin) return callback(null, true)
      if (allowedOrigins.indexOf(origin) !== -1 || /^http:\/\/localhost:\d+$/.test(origin)) {
        return callback(null, true)
      }
      return callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
  })
)

// ─── Request Parsing ───────────────────────────────────────────────────────────
// Parse incoming JSON request bodies
app.use(express.json())
// Parse URL-encoded form bodies (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: false }))
// Parse Cookies
app.use(cookieParser())

// ─── Data Sanitization & Rate Limiting ─────────────────────────────────────────
// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again in 15 minutes'
})
// Apply limiter to all API routes
app.use('/api', limiter)

// Express 5 compatible Data sanitization against NoSQL query injection ($ and . keys)
app.use((req, res, next) => {
  const sanitize = (obj) => {
    if (!obj || typeof obj !== 'object') return
    for (const key in obj) {
      if (key.startsWith('$') || key.includes('.')) {
        delete obj[key]
      } else if (typeof obj[key] === 'object') {
        sanitize(obj[key])
      }
    }
  }
  if (req.body) sanitize(req.body)
  if (req.params) sanitize(req.params)
  next()
})

// Express 5 compatible Data sanitization against XSS
app.use((req, res, next) => {
  const clean = (val) => {
    if (typeof val === 'string') {
      return val.replace(/</g, '&lt;').replace(/>/g, '&gt;')
    }
    if (val && typeof val === 'object') {
      for (const k in val) {
        val[k] = clean(val[k])
      }
    }
    return val
  }
  if (req.body) clean(req.body)
  if (req.params) clean(req.params)
  next()
})

// Prevent HTTP Parameter Pollution
app.use(hpp())

// ─── HTTP Request Logger ───────────────────────────────────────────────────────
// 'dev' format: colorized output → "POST /api/auth/signup 201 12ms"
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'))
}

// ─── Health Check Route ────────────────────────────────────────────────────────
// Useful for Render / Vercel deployment health probes
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Startup Forge API is running 🚀',
    environment: process.env.NODE_ENV || 'development',
  })
})

// ─── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',     authRoutes)      // Phase 2 ✅
app.use('/api/generate', startupRoutes)   // Phase 3 ✅ — frontend GENERATE alias
app.use('/api/startup',  startupRoutes)   // Phase 3 ✅ — architecture spec
app.use('/api/profile',  userRoutes)      // Phase 4 ✅ — profile management
app.use('/api/settings', settingsRoutes)  // Phase 4 ✅ — user preferences
app.use('/api/history',  historyRoutes)   // Phase 4 ✅ — saved kits history
app.use('/api/finance',  financeRoutes)   // Member 4 ✅ — finance calculator & reports

// ─── 404 + Global Error Handlers ──────────────────────────────────────────────
// Must always be registered LAST, after all routes
app.use(notFound)
app.use(errorHandler)

module.exports = app
