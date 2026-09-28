import { SpeedInsights } from '@vercel/speed-insights/react'
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
          <SpeedInsights />
        </ToastProvider>
      </StartupProvider>
    </AuthProvider>
  )
}
