import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import api from '@/lib/api'

interface User {
  id_usuario: number
  nombre: string
  cargo: string
}

interface AuthContextType {
  user: User | null
  login: (nombre: string, contrasenia: string) => Promise<boolean>
  register: (nombre: string, contrasenia: string, cargo: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  isAdmin: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (nombre: string, contrasenia: string): Promise<boolean> => {
    try {
      const response = await api.post('/usuarios/login', { nombre, contrasenia })
      const userData = response.data
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const register = async (nombre: string, contrasenia: string, cargo: string): Promise<boolean> => {
    try {
      const response = await api.post('/usuarios/register', { nombre, contrasenia, cargo })
      const userData = response.data
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      return true
    } catch (error) {
      console.error('Register error:', error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const isAuthenticated = !!user
  const isAdmin = user?.cargo.toLowerCase() === 'administrador' || user?.cargo.toLowerCase() === 'admin'

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
