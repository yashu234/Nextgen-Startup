import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ROUTES } from '../../constants/routes'
import { PageLoader } from '../Loader'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <PageLoader />
  }

  if (!isAuthenticated) {
    // Preserve the intended destination for redirect after login
    return (
      <Navigate
        to={ROUTES.LOGIN}
        state={{ from: location.pathname }}
        replace
      />
    )
  }

  return children
}
