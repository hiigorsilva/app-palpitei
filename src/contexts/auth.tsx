import { useQueryClient } from '@tanstack/react-query'
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import {
  getStorageAdminAuth,
  getStorageAuth,
  removeStorageAdminAuth,
  removeStorageAuth,
  setStorageAdminAuth,
  setStorageAuth,
} from '@/helpers/auth'
import { createUser } from '@/services/login/api'
import type { ILogin } from '@/services/login/type'
import type { IUser } from '@/services/users/type'

export interface IAuthContext {
  user: IUser | null
  isAuthenticated: boolean
  login: (data: ILogin) => Promise<IUser>
  adminLogin: (data: {
    username: string
    password: string
  }) => Promise<{ username: string; password: string }>
  logout: () => void
}

const AuthContext = createContext<IAuthContext | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [user, setUser] = useState<IUser | null>(() => getStorageAuth())
  const [admin, setAdmin] = useState<{
    username: string
    password: string
  } | null>(() => getStorageAdminAuth())

  const login = useCallback(
    async (credentials: ILogin) => {
      const authenticatedUser = await createUser(credentials)

      setStorageAuth(authenticatedUser)
      setUser(authenticatedUser)
      queryClient.invalidateQueries({ queryKey: ['users'] })

      return authenticatedUser
    },
    [queryClient]
  )
  const adminLogin = useCallback(
    async (credentials: { username: string; password: string }) => {
      // add credenciais na session storage para autenticar o admin
      const credentialsAuth = {
        username: credentials.username,
        password: credentials.password,
      }

      setStorageAdminAuth(credentialsAuth)
      setAdmin(credentialsAuth)
      queryClient.invalidateQueries({ queryKey: ['users'] })

      return credentialsAuth
    },
    [queryClient]
  )

  const logout = useCallback(() => {
    removeStorageAuth()
    removeStorageAdminAuth()
    setUser(null)
    setAdmin(null)
    queryClient.invalidateQueries({ queryKey: ['users'] })
  }, [queryClient])

  const value = useMemo(
    () => ({
      user,
      admin,
      isAuthenticated: Boolean(user),
      isAdminAuthenticated: Boolean(admin),
      login,
      adminLogin,
      logout,
    }),
    [user, admin, login, adminLogin, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }

  return context
}
