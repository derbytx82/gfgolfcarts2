import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { LoadingState } from '../components/common/LoadingState'
import { useAuth } from '../hooks/useAuth'

export function ProtectedRoute() {
  const { session, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="section-container py-12">
        <LoadingState label="Checking session..." />
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/golfpanel/login" replace state={{ from: location }} />
  }

  return <Outlet />
}