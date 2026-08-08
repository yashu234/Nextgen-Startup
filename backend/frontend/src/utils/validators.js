// ─── Field Validators ────────────────────────────────────────

export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email) return 'Email is required'
  if (!re.test(email)) return 'Please enter a valid email address'
  return null
}

export function validatePassword(password) {
  if (!password) return 'Password is required'
  if (password.length < 8) return 'Password must be at least 8 characters'
  return null
}

export function validateRequired(value, fieldName = 'This field') {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`
  }
  return null
}

export function validateMinLength(value, min, fieldName = 'This field') {
  if (!value) return `${fieldName} is required`
  if (value.trim().length < min) return `${fieldName} must be at least ${min} characters`
  return null
}

export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) return 'Please confirm your password'
  if (password !== confirmPassword) return 'Passwords do not match'
  return null
}

// ─── Form Validation ─────────────────────────────────────────

export function validateSignupForm(values) {
  const errors = {}
  const nameError = validateMinLength(values.name, 2, 'Name')
  if (nameError) errors.name = nameError

  const emailError = validateEmail(values.email)
  if (emailError) errors.email = emailError

  const passwordError = validatePassword(values.password)
  if (passwordError) errors.password = passwordError

  const confirmError = validateConfirmPassword(values.password, values.confirmPassword)
  if (confirmError) errors.confirmPassword = confirmError

  return errors
}

export function validateLoginForm(values) {
  const errors = {}
  const emailError = validateEmail(values.email)
  if (emailError) errors.email = emailError

  const passwordError = validateRequired(values.password, 'Password')
  if (passwordError) errors.password = passwordError

  return errors
}

export function validateStartupForm(values) {
  const errors = {}

  const ideaError = validateMinLength(values.idea, 10, 'Startup idea')
  if (ideaError) errors.idea = ideaError

  const industryError = validateRequired(values.industry, 'Industry')
  if (industryError) errors.industry = industryError

  const businessTypeError = validateRequired(values.businessType, 'Business type')
  if (businessTypeError) errors.businessType = businessTypeError

  const budgetError = validateRequired(values.budget, 'Budget')
  if (budgetError) errors.budget = budgetError

  const audienceError = validateRequired(values.targetAudience, 'Target audience')
  if (audienceError) errors.targetAudience = audienceError

  const locationError = validateRequired(values.location, 'Business location')
  if (locationError) errors.location = locationError

  return errors
}

// Returns true if the errors object has no keys
export function isValid(errors) {
  return Object.keys(errors).length === 0
}
