import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, Menu, X, User, LogOut, LayoutDashboard, Settings, ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { SIDEBAR_ITEMS } from '../../constants'
import { ROUTES } from '../../constants/routes'
import { getInitials } from '../../utils/formatters'
import Button from '../Button'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const mobileMenuId = 'mobile-navigation-menu'
  const userMenuId = 'user-navigation-menu'

  function handleLogout() {
    logout()
    toast.success('Logged out successfully')
    navigate(ROUTES.HOME)
    setUserMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 transition-colors duration-300">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to={ROUTES.HOME}
          className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <span className="text-lg">Startup Forge</span>
        </Link>

        {/* Desktop right actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface-secondary text-text-primary transition-colors"
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
                aria-controls={userMenuId}
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
                  {getInitials(user?.name)}
                </div>
                <span className="text-sm font-medium text-text-secondary">{user?.name}</span>
                <ChevronDown size={14} className="text-text-tertiary" />
              </button>

              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div id={userMenuId} className="absolute right-0 top-full mt-2 w-48 bg-surface rounded-xl border border-border shadow-lg z-20 overflow-hidden animate-fade-in-scale transition-colors duration-200">
                    <Link
                      to={ROUTES.DASHBOARD}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-secondary hover:bg-surface-secondary transition-colors"
                    >
                      <LayoutDashboard size={16} className="text-text-tertiary" />
                      Dashboard
                    </Link>
                    <Link
                      to={ROUTES.PROFILE}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-secondary hover:bg-surface-secondary transition-colors"
                    >
                      <User size={16} className="text-text-tertiary" />
                      Profile
                    </Link>
                    <Link
                      to={ROUTES.SETTINGS}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-secondary hover:bg-surface-secondary transition-colors"
                    >
                      <Settings size={16} className="text-text-tertiary" />
                      Settings
                    </Link>
                    <div className="border-t border-border/50" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 transition-colors w-full text-left"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link to={ROUTES.LOGIN}>
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to={ROUTES.SIGNUP}>
                <Button variant="primary" size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-surface-secondary text-text-primary transition-colors"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls={mobileMenuId}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div id={mobileMenuId} className="md:hidden border-t border-border bg-surface px-4 py-4 space-y-2 animate-fade-in transition-colors duration-200">
          {isAuthenticated ? (
            <>
              <Link
                to={ROUTES.DASHBOARD}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-surface-secondary"
              >
                <LayoutDashboard size={16} className="text-text-tertiary" />
                Dashboard
              </Link>
              <Link
                to={ROUTES.PROFILE}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-surface-secondary"
              >
                <User size={16} className="text-text-tertiary" />
                Profile
              </Link>
              <Link
                to={ROUTES.SETTINGS}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-surface-secondary"
              >
                <Settings size={16} className="text-text-tertiary" />
                Settings
              </Link>
              <button
                onClick={() => { handleLogout(); setMobileOpen(false) }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-500/10 w-full text-left"
              >
                <LogOut size={16} />
                Sign Out
              </button>
              <div className="pt-3 mt-3 border-t border-border/50">
                <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wide text-text-tertiary">
                  Startup modules
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {SIDEBAR_ITEMS.filter((item) => item.path !== ROUTES.DASHBOARD).map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className="px-3 py-2 rounded-lg text-xs text-text-secondary hover:bg-surface-secondary"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <Link to={ROUTES.LOGIN} onClick={() => setMobileOpen(false)}>
                <Button variant="outline" size="md" className="w-full">Sign In</Button>
              </Link>
              <Link to={ROUTES.SIGNUP} onClick={() => setMobileOpen(false)}>
                <Button variant="primary" size="md" className="w-full">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>

  )
}
