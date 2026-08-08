import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import authService from '../../services/authService'
import { validateSignupForm, isValid } from '../../utils/validators'
import { parseApiError } from '../../utils/formatters'
import { ROUTES } from '../../constants/routes'
import { Input } from '../../components/Input'
import Button from '../../components/Button'

export default function Signup() {
  const { login } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const validation = validateSignupForm(values)
    if (!isValid(validation)) {
      setErrors(validation)
      return
    }

    setLoading(true)
    try {
      const { user } = await authService.signup(
        values.name,
        values.email,
        values.password
      )
      login(user)
      toast.success(`Welcome to Startup Forge, ${user.name}! 🚀`)
      navigate(ROUTES.DASHBOARD, { replace: true })
    } catch (error) {
      toast.error(parseApiError(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
        <p className="mt-2 text-sm text-slate-500">
          Start building your startup kit in minutes
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          label="Full name"
          name="name"
          type="text"
          placeholder="Jane Smith"
          autoComplete="name"
          icon={User}
          value={values.name}
          onChange={handleChange}
          error={errors.name}
          required
        />

        <Input
          label="Email address"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          icon={Mail}
          value={values.email}
          onChange={handleChange}
          error={errors.email}
          required
        />

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          icon={Lock}
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          hint="Minimum 8 characters"
          required
        />

        <Input
          label="Confirm password"
          name="confirmPassword"
          type="password"
          placeholder="Repeat your password"
          autoComplete="new-password"
          icon={Lock}
          value={values.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={loading}
          className="w-full mt-2"
        >
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link
          to={ROUTES.LOGIN}
          className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}
