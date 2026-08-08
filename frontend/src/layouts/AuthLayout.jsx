import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Zap } from 'lucide-react'
import { ROUTES } from '../constants/routes'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <Link
        to={ROUTES.HOME}
        className="flex items-center gap-2 font-bold text-slate-900 hover:opacity-80 transition-opacity mb-8"
      >
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
          <Zap size={20} className="text-white" />
        </div>
        <span className="text-xl">Startup Forge</span>
      </Link>

      {/* Auth card */}
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-8 animate-fade-in-scale">
        <Outlet />
      </div>
    </div>
  )
}
