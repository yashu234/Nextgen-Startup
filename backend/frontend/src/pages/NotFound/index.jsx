import { Link } from 'react-router-dom'
import { Home as HomeIcon, LayoutDashboard, AlertCircle } from 'lucide-react'
import { ROUTES } from '../../constants/routes'
import Button from '../../components/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-500 mb-6 shadow-sm">
        <AlertCircle size={40} />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 mb-2">404 - Page Not Found</h1>
      <p className="text-slate-500 max-w-md mb-8 text-sm leading-relaxed">
        The page or route you are looking for does not exist or may have been moved.
      </p>
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <Link to={ROUTES.DASHBOARD}>
          <Button variant="primary" icon={LayoutDashboard}>
            Return to Dashboard
          </Button>
        </Link>
        <Link to={ROUTES.HOME}>
          <Button variant="outline" icon={HomeIcon}>
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
