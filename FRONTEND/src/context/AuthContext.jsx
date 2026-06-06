import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext(null)

const TOKEN_KEY = 'travelhub:admin:token'
const ADMIN_KEY = 'travelhub:admin:info'

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [admin, setAdmin] = useState(() => {
    try {
      const raw = localStorage.getItem(ADMIN_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  const isAdmin = !!token

  const login = useCallback((newToken, adminInfo) => {
    setToken(newToken)
    setAdmin(adminInfo)
    localStorage.setItem(TOKEN_KEY, newToken)
    localStorage.setItem(ADMIN_KEY, JSON.stringify(adminInfo))
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setAdmin(null)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(ADMIN_KEY)
  }, [])

  const authHeader = useCallback(() => ({
    Authorization: token ? `Bearer ${token}` : ''
  }), [token])

  // Validate token on mount (optional but good UX)
  useEffect(() => {
    if (!token) return
    // If token is present but invalid/expired on next visit, clear it
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
    fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) logout()
      })
      .catch(() => {
        // Network error — keep session, don't log out
      })
  }, []) // run once on mount

  return (
    <AuthContext.Provider value={{ isAdmin, token, admin, login, logout, authHeader }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default AuthContext
