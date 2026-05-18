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
  getStorageAuth,
  removeStorageAuth,
  setStorageAuth,
} from '@/helpers/auth'
import { createUser } from '@/services/login/api'
import type { ILogin } from '@/services/login/type'
import type { IUser } from '@/services/users/type'

export interface IAuthContext {
  user: IUser | null
  isAuthenticated: boolean
  login: (data: ILogin) => Promise<IUser>
  logout: () => void
}

const AuthContext = createContext<IAuthContext | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [user, setUser] = useState<IUser | null>(() => getStorageAuth())

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

  const logout = useCallback(() => {
    removeStorageAuth()
    setUser(null)
    queryClient.invalidateQueries({ queryKey: ['users'] })
  }, [queryClient])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user, login, logout]
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
