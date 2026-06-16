import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('almacontrol_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      // Hidratar el usuario desde localStorage si existe
      const stored = localStorage.getItem('almacontrol_user')
      if (stored) {
        try { setUser(JSON.parse(stored)) } catch {}
      }
    }
    setLoading(false)
  }, [token])

  const loginUser = (tokenValue, userData) => {
    localStorage.setItem('almacontrol_token', tokenValue)
    localStorage.setItem('almacontrol_user', JSON.stringify(userData))
    setToken(tokenValue)
    setUser(userData)
  }

  const logoutUser = () => {
    localStorage.removeItem('almacontrol_token')
    localStorage.removeItem('almacontrol_user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
