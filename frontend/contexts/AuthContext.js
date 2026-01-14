import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setUser(null)
        setLoading(false)
        return
      }

      // Verify token with backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data)
        setIsAuthenticated(true)
      } else {
        setUser(null)
        setIsAuthenticated(false)
        localStorage.removeItem('token')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setUser(null)
      setIsAuthenticated(false)
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  const login = (token, user, refreshToken) => {
    localStorage.setItem('token', token)
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken)
    }
    setUser(user)
    setIsAuthenticated(true)
    setLoading(false)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    setUser(null)
    setIsAuthenticated(false)
    setLoading(false)
    window.location.href = '/auth/login'
  }

  const value = {
    user,
    loading,
    login,
    logout,
    checkAuthStatus,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
