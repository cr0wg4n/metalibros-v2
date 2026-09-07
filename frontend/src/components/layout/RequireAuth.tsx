import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/auth-store'
import { ROUTES } from '@/config/routes'

function RequireAuth() {
  const isInitializing = useAuthStore((state) => state.isInitializing)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (isInitializing) return null

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.home} replace />
  }

  return <Outlet />
}

export default RequireAuth
