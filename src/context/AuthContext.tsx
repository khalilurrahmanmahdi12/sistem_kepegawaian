import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

import { users, type User } from '../data/users'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  kirimOtp: (identifier: string) => User | null
  verifikasiOtp: (otp: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('hris_user')

    return savedUser ? JSON.parse(savedUser) : null
  })

  const [pendingUser, setPendingUser] = useState<User | null>(null)

  useEffect(() => {
    if (user) {
      localStorage.setItem('hris_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('hris_user')
    }
  }, [user])

  const kirimOtp = (identifier: string) => {
    const normalized = identifier.trim().toLowerCase()

    const foundUser = users.find(
      (item) =>
        item.email.toLowerCase() === normalized ||
        item.whatsapp === identifier.trim()
    )

    if (!foundUser) {
      return null
    }

    setPendingUser(foundUser)

    return foundUser
  }

  const verifikasiOtp = (otp: string) => {
    if (!pendingUser) {
      return false
    }

    if (otp !== '123456') {
      return false
    }

    setUser(pendingUser)
    setPendingUser(null)

    return true
  }

  const logout = () => {
    setUser(null)
    setPendingUser(null)
    localStorage.removeItem('hris_user')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        kirimOtp,
        verifikasiOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider')
  }

  return context
}