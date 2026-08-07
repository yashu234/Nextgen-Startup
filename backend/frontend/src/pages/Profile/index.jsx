import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Save, ShieldCheck, Calendar, Activity, Download, Globe, LogOut, Settings } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import authService from '../../services/authService'
import { validateEmail, validateMinLength, validatePassword } from '../../utils/validators'
import { parseApiError, getInitials, formatDate } from '../../utils/formatters'
import { ROUTES } from '../../constants/routes'
import Card from '../../components/Card'
import { Input } from '../../components/Input'
import Button from '../../components/Button'

export default function Profile() {
  const { user, updateUser, logout } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [profileValues, setProfileValues] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })
  const [profileErrors, setProfileErrors] = useState({})
  const [profileLoading, setProfileLoading] = useState(false)

  const [passwordValues, setPasswordValues] = useState({
    currentPassword: '',
    newPassword: '',
  })
  const [passwordErrors, setPasswordErrors] = useState({})
  const [passwordLoading, setPasswordLoading] = useState(false)

  const [language, setLanguage] = useState('English (US)')

  function handleProfileChange(e) {
    const { name, value } = e.target
    setProfileValues((prev) => ({ ...prev, [name]: value }))
    if (profileErrors[name]) setProfileErrors((prev) => ({ ...prev, [name]: null }))
  }

  function handlePasswordChange(e) {
    const { name, value } = e.target
    setPasswordValues((prev) => ({ ...prev, [name]: value }))
    if (passwordErrors[name]) setPasswordErrors((prev) => ({ ...prev, [name]: null }))
  }

  async function handleProfileSubmit(e) {
    e.preventDefault()
    const errors = {}
    const nameErr = validateMinLength(profileValues.name, 2, 'Name')
    if (nameErr) errors.name = nameErr
    const emailErr = validateEmail(profileValues.email)
    if (emailErr) errors.email = emailErr

    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors)
      return
    }

    setProfileLoading(true)
    try {
      const updated = await authService.updateProfile(profileValues)
      updateUser(updated)
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error(parseApiError(error))
    } finally {
      setProfileLoading(false)
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault()
    const errors = {}
    if (!passwordValues.currentPassword) errors.currentPassword = 'Current password is required'
    const newPassErr = validatePassword(passwordValues.newPassword)
    if (newPassErr) errors.newPassword = newPassErr

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors)
      return
    }

    setPasswordLoading(true)
    try {
      await authService.changePassword(
        passwordValues.currentPassword,
        passwordValues.newPassword
      )
      toast.success('Password changed successfully!')
      setPasswordValues({ currentPassword: '', newPassword: '' })
    } catch (error) {
      toast.error(parseApiError(error))
    } finally {
      setPasswordLoading(false)
    }
  }

  function handleLogout() {
    logout()
    toast.success('Logged out')
    navigate(ROUTES.HOME)
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <User className="text-blue-600" size={24} />
            User Profile & Account
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Personal profile information, security credentials, and activity metrics.
          </p>
        </div>
        <Button variant="ghost" size="sm" icon={LogOut} onClick={handleLogout} className="text-red-500 hover:bg-red-50">
          Sign Out
        </Button>
      </div>

      {/* User Avatar & Account Overview Header */}
      <Card className="bg-slate-900 text-white p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center font-bold text-xl text-white shadow-lg">
              {getInitials(user?.name)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{user?.name || 'Founder'}</h2>
              <p className="text-slate-400 text-sm">{user?.email}</p>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                <span className="flex items-center gap-1"><Calendar size={13} /> Member since {formatDate(user?.createdAt || new Date())}</span>
                <span className="inline-flex items-center gap-1 text-emerald-400 font-medium"><ShieldCheck size={13} /> Active Founder</span>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" icon={Settings} onClick={() => navigate(ROUTES.SETTINGS)} className="bg-white/10 border-white/20 text-white hover:bg-white/20">
            Settings
          </Button>
        </div>
      </Card>

      {/* Stats Summary */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="bg-blue-50/50 border-blue-100">
          <span className="text-xs font-semibold text-blue-600 uppercase flex items-center gap-1"><Activity size={14} /> Generated Kits</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">3 Projects</p>
        </Card>

        <Card className="bg-purple-50/50 border-purple-100">
          <span className="text-xs font-semibold text-purple-600 uppercase flex items-center gap-1"><Download size={14} /> Downloads</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">12 Files</p>
        </Card>

        <Card className="bg-emerald-50/50 border-emerald-100">
          <span className="text-xs font-semibold text-emerald-600 uppercase flex items-center gap-1"><ShieldCheck size={14} /> Account Status</span>
          <p className="text-sm font-bold text-slate-900 mt-2">Pro Founder Tier</p>
        </Card>
      </div>

      {/* Edit Profile Form */}
      <Card>
        <Card.Header>
          <Card.Title>Edit Profile Information</Card.Title>
        </Card.Header>
        <Card.Body>
          <form onSubmit={handleProfileSubmit} className="space-y-4" noValidate>
            <Input
              label="Full Name"
              name="name"
              type="text"
              icon={User}
              value={profileValues.name}
              onChange={handleProfileChange}
              error={profileErrors.name}
              required
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              icon={Mail}
              value={profileValues.email}
              onChange={handleProfileChange}
              error={profileErrors.email}
              required
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={Save}
              loading={profileLoading}
            >
              Save Profile Changes
            </Button>
          </form>
        </Card.Body>
      </Card>

      {/* Change Password Form */}
      <Card>
        <Card.Header>
          <Card.Title>Security Credentials</Card.Title>
        </Card.Header>
        <Card.Body>
          <form onSubmit={handlePasswordSubmit} className="space-y-4" noValidate>
            <Input
              label="Current Password"
              name="currentPassword"
              type="password"
              icon={Lock}
              value={passwordValues.currentPassword}
              onChange={handlePasswordChange}
              error={passwordErrors.currentPassword}
              required
            />
            <Input
              label="New Password"
              name="newPassword"
              type="password"
              icon={Lock}
              value={passwordValues.newPassword}
              onChange={handlePasswordChange}
              error={passwordErrors.newPassword}
              required
            />
            <Button
              type="submit"
              variant="outline"
              size="md"
              loading={passwordLoading}
            >
              Update Password
            </Button>
          </form>
        </Card.Body>
      </Card>

      {/* Future Ready Preferences Section */}
      <Card>
        <Card.Header>
          <Card.Title className="flex items-center gap-2">
            <Globe size={18} className="text-blue-600" /> Language & Regional Preferences
          </Card.Title>
        </Card.Header>
        <Card.Body className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-800">Interface Language</p>
              <p className="text-xs text-slate-500">Select language for AI generated output recommendations</p>
            </div>
            <select
              value={language}
              onChange={(e) => { setLanguage(e.target.value); toast.success('Language preference saved.'); }}
              className="h-9 px-3 text-xs rounded-lg border border-slate-300 bg-white"
            >
              <option value="English (US)">English (US)</option>
              <option value="Spanish">Spanish (Español)</option>
              <option value="French">French (Français)</option>
              <option value="German">German (Deutsch)</option>
            </select>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}
