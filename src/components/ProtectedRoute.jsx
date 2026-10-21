import { Navigate, useLocation } from 'react-router-dom'
import { PageLoader } from './LoadingState'
import { useAuth } from '../hooks/useAuth'

export const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <PageLoader fullscreen />
  if (!user || user.is_active === false) return <Navigate to="/login" replace state={{ from: location }} />
  if (user.must_change_password && location.pathname !== '/change-password') return <Navigate to="/change-password" replace />
  if (roles.length && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />
  return children
}
