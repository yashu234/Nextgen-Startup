import { Link } from 'react-router-dom'
import { Zap } from 'lucide-react'
import { ROUTES } from '../../constants/routes'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-200 bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <Link
            to={ROUTES.HOME}
            className="flex items-center gap-2 font-semibold text-slate-900 hover:opacity-80 transition-opacity"
          >
            <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center">
              <Zap size={13} className="text-white" />
            </div>
            Startup Forge
          </Link>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link to={ROUTES.HOME} className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <Link to={ROUTES.NEW} className="hover:text-slate-900 transition-colors">
              Generate
            </Link>
            <Link to={ROUTES.HISTORY} className="hover:text-slate-900 transition-colors">
              History
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-xs text-slate-400">
            © {year} Startup Forge. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
