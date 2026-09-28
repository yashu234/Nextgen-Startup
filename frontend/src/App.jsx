import { Analytics } from '@vercel/analytics/react'
import { AuthProvider } from './context/AuthContext'
import { StartupProvider } from './context/StartupContext'
import { ToastProvider } from './context/ToastContext'
import ToastContainer from './components/Toast'
import AppRouter from './routes/AppRouter'

export default function App() {
  return (
    <AuthProvider>
      <StartupProvider>
        <ToastProvider>
          <AppRouter />
          <ToastContainer />
          <Analytics />
        </ToastProvider>
      </StartupProvider>
    </AuthProvider>
  )
}
