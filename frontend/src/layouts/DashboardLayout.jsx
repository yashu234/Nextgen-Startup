import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import ProtectedRoute from '../components/ProtectedRoute'

export default function DashboardLayout() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 min-w-0 p-6 lg:p-8 max-w-6xl">
            <Outlet />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
