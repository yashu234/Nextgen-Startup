import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import authService from '../../services/authService'
import { validateLoginForm, isValid } from '../../utils/validators'
import { parseApiError } from '../../utils/formatters'
import { ROUTES } from '../../constants/routes'
import { Input } from '../../components/Input'
import Button from '../../components/Button'

export default function Login() {
  const { login } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const [values, setValues] = useState({ email: '', password: '' })
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const redirectTo = location.state?.from || ROUTES.DASHBOARD

  function handleChange(e) {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const validation = validateLoginForm(values)
    if (!isValid(validation)) {
      setErrors(validation)
      return
    }

    setLoading(true)
    try {
      const { user } = await authService.login(values.email, values.password)
      login(user, rememberMe)
      toast.success(`Welcome back, ${user.name}!`)
      navigate(redirectTo, { replace: true })
    } catch (error) {
      toast.error(parseApiError(error))
    } finally {
      setLoading(false)
    }
  }

  function handleForgotPassword(e) {
    e.preventDefault()
    toast.info('Password reset feature available in settings or via email recovery.')
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-500">Sign in to your Startup Forge account</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
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
          placeholder="Enter your password"
          autoComplete="current-password"
          icon={Lock}
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          required
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            Remember me
          </label>
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-blue-600 hover:text-blue-700 font-medium text-xs transition-colors"
          >
            Forgot password?
          </button>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={loading}
          className="w-full"
        >
          Sign In
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Don&apos;t have an account?{' '}
        <Link
          to={ROUTES.SIGNUP}
          className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          Create one free
        </Link>
      </p>
    </div>
  )
}
