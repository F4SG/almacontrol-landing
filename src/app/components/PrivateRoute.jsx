import { Navigate } from 'react-router-dom'

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem('almacontrol_token')
  return token ? children : <Navigate to="/login" replace />
}
