import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../constants/storage'
import { useAuth } from '../context/AuthContext'

export function HomePage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const handleLogout = () => { logout(); navigate(ROUTES.LOGIN) }

  return (
    <main className="home-page">
      <header className="home-header"><div className="mobile-brand"><span className="brand-mark">L</span> LOGIFY</div><button className="text-button" onClick={handleLogout}>Log out</button></header>
      <section className="home-content"><p className="eyebrow">YOUR PERSONAL SPACE</p><h1>Welcome, {user?.username}.</h1><p className="home-lead">You are signed in and ready to go.</p><div className="profile-card"><span className="profile-label">ACCOUNT DETAILS</span><div><strong>{user?.username}</strong><p>{user?.email}</p></div></div></section>
    </main>
  )
}
