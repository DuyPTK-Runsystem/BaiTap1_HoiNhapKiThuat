import { Navigate, Outlet } from 'react-router-dom'
import { ROUTES } from '../constants/storage'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute() {
  const { user } = useAuth()
  return user ? <Outlet /> : <Navigate replace to={ROUTES.LOGIN} />
}
