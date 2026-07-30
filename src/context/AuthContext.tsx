import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { clearSession, getSession, saveSession } from '../storage/localStorage'
import { login as loginRequest, register as registerRequest } from '../services/authService'
import type { LoginInput, PublicUser, RegisterInput } from '../types/auth'

interface AuthContextValue {
  user: PublicUser | null
  isLoading: boolean
  login: (input: LoginInput) => Promise<void>
  register: (input: RegisterInput) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(getSession)
  const [isLoading, setIsLoading] = useState(false)

  const login = async (input: LoginInput) => {
    setIsLoading(true)
    try {
      const response = await loginRequest(input)
      if (!response.data || response.statusCode >= 400) {
        throw new Error(typeof response.message === 'string' ? response.message : 'Vui lòng kiểm tra username và password')
      }
      saveSession(response.data)
      setUser(response.data)
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (input: RegisterInput) => {
    setIsLoading(true)
    try {
      const response = await registerRequest(input)
      if (!response.data || response.statusCode >= 400) {
        throw new Error(typeof response.message === 'string' ? response.message : 'Không thể tạo tài khoản')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    clearSession()
    setUser(null)
  }

  const value = useMemo(() => ({ user, isLoading, login, register, logout }), [user, isLoading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
