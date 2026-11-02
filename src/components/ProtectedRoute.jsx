import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ roleRequis }) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/connexion" replace />
  if (roleRequis && user.role !== roleRequis) return <Navigate to="/" replace />

  return <Outlet />
}