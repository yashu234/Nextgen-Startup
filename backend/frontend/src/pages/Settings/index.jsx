import { useState } from 'react'
import { Settings as SettingsIcon, Sun, Moon, Monitor, Bell, Shield, Download, Trash2, LogOut } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import useTheme from '../../hooks/useTheme'
import Card from '../../components/Card'
import Button from '../../components/Button'

export default function Settings() {
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState({
    email: true,
    projectUpdates: true,
    marketing: false,
  })

  function handleAppearanceChange(mode) {
    setTheme(mode)
    toast.success(`Theme set to ${mode} mode`)
  }

  function handleNotificationToggle(key) {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
    toast.info('Notification preferences updated.')
  }

  function handleExportData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ user: 'demo', history: [] }, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute("href", dataStr)
    downloadAnchor.setAttribute("download", "startup_forge_account_data.json")
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
    toast.success('Account data exported.')
  }

  function handleLogoutAll() {
    toast.info('Logout all sessions will be connected in a future backend release.')
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <SettingsIcon className="text-blue-600" size={24} />
          Application Settings
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage appearance preferences, email notifications, privacy settings, and account data.
        </p>
      </div>

      {/* Appearance */}
      <Card>
        <Card.Header>
          <Card.Title className="flex items-center gap-2">
            <Monitor size={18} className="text-blue-600" /> Appearance & Theme
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleAppearanceChange('light')}
              className={`p-4 rounded-xl border flex flex-col items-center gap-2 text-xs font-semibold transition-all ${
                theme === 'light' ? 'border-blue-600 bg-blue-50/50 text-blue-700' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Sun size={20} className="text-amber-500" /> Light Mode
            </button>
            <button
              onClick={() => handleAppearanceChange('dark')}
              className={`p-4 rounded-xl border flex flex-col items-center gap-2 text-xs font-semibold transition-all ${
                theme === 'dark' ? 'border-blue-600 bg-blue-50/50 text-blue-700' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Moon size={20} className="text-indigo-500" /> Dark Mode
            </button>
            <button
              onClick={() => handleAppearanceChange('system')}
              className={`p-4 rounded-xl border flex flex-col items-center gap-2 text-xs font-semibold transition-all ${
                theme === 'system' ? 'border-blue-600 bg-blue-50/50 text-blue-700' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Monitor size={20} className="text-slate-500" /> System Default
            </button>
          </div>
        </Card.Body>
      </Card>

      {/* Notifications */}
      <Card>
        <Card.Header>
          <Card.Title className="flex items-center gap-2">
            <Bell size={18} className="text-indigo-600" /> Notifications & Alerts
          </Card.Title>
        </Card.Header>
        <Card.Body className="space-y-4">
          <p className="text-xs text-slate-500">
            Notification preferences are stored locally in this build.
          </p>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium text-slate-800">Email Notifications</p>
              <p className="text-xs text-slate-500">Receive emails when your generated kits are ready</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.email}
              onChange={() => handleNotificationToggle('email')}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-slate-100">
            <div>
              <p className="text-sm font-medium text-slate-800">Project Updates</p>
              <p className="text-xs text-slate-500">Receive alerts on new features and template improvements</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.projectUpdates}
              onChange={() => handleNotificationToggle('projectUpdates')}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-slate-100">
            <div>
              <p className="text-sm font-medium text-slate-800">Marketing & Founder Digest</p>
              <p className="text-xs text-slate-500">Weekly startup resources and growth articles</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.marketing}
              onChange={() => handleNotificationToggle('marketing')}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
          </label>
        </Card.Body>
      </Card>

      {/* Privacy & Account Export */}
      <Card>
        <Card.Header>
          <Card.Title className="flex items-center gap-2">
            <Shield size={18} className="text-emerald-600" /> Privacy & Data Management
          </Card.Title>
        </Card.Header>
        <Card.Body className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-800">Export Account Data</p>
            <p className="text-xs text-slate-500">Download a JSON backup of your user profile and history</p>
          </div>
          <Button variant="outline" size="sm" icon={Download} onClick={handleExportData}>
            Export JSON
          </Button>
        </Card.Body>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 bg-red-50/20">
        <Card.Header>
          <Card.Title className="text-red-900">Danger Zone</Card.Title>
        </Card.Header>
        <Card.Body className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800">Logout All Sessions</p>
              <p className="text-xs text-slate-500">Backend-connected session management is coming soon.</p>
            </div>
            <Button variant="ghost" size="sm" icon={LogOut} onClick={handleLogoutAll} className="text-slate-600">
              Sign Out All
            </Button>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-red-200">
            <div>
              <p className="text-sm font-semibold text-red-900">Delete Account</p>
                <p className="text-xs text-slate-500">Account deletion requires backend support and is not enabled yet.</p>
            </div>
              <Button variant="danger" size="sm" icon={Trash2} onClick={() => toast.info('Account deletion will be connected in a future release.') }>
              Delete Account
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}
