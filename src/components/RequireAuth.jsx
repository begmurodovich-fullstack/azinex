import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export function RequireAuth() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/signup" replace />
  return <Outlet />
}
