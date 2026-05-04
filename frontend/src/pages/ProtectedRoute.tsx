import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const user = useAuthStore((state) => state.user)
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return children
}
