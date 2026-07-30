import { Navigate, Route, Routes } from 'react-router-dom'
import { ROUTES } from './constants/storage'
import { useAuth } from './context/AuthContext'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ProtectedRoute } from './router/ProtectedRoute'

export function App() {
  const { user } = useAuth()
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={user ? <Navigate replace to={ROUTES.HOME} /> : <LoginPage />} />
      <Route path={ROUTES.REGISTER} element={user ? <Navigate replace to={ROUTES.HOME} /> : <RegisterPage />} />
      <Route element={<ProtectedRoute />}><Route path={ROUTES.HOME} element={<HomePage />} /></Route>
      <Route path="*" element={<Navigate replace to={user ? ROUTES.HOME : ROUTES.LOGIN} />} />
    </Routes>
  )
}
