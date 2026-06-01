import type { IUser } from '@/services/users/type'

const STORAGE_KEY = '@palpitei:auth'
const ADMIN_STORAGE_KEY = '@palpitei:admin-auth'

type AuthUser = IUser

type AdminAuthData = {
  username: string
  password: string
}

export function getStorageAuth(): AuthUser | null {
  if (typeof window === 'undefined') return null

  const data = sessionStorage.getItem(STORAGE_KEY)
  if (!data) return null

  try {
    return JSON.parse(data) as AuthUser
  } catch {
    return null
  }
}

export function setStorageAuth(data: AuthUser) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function removeStorageAuth() {
  sessionStorage.removeItem(STORAGE_KEY)
}

export function getStorageAdminAuth(): AdminAuthData | null {
  if (typeof window === 'undefined') return null

  const data = sessionStorage.getItem(ADMIN_STORAGE_KEY)
  if (!data) return null

  try {
    return JSON.parse(data) as AdminAuthData
  } catch {
    return null
  }
}

export function setStorageAdminAuth(data: AdminAuthData) {
  sessionStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(data))
}

export function removeStorageAdminAuth() {
  sessionStorage.removeItem(ADMIN_STORAGE_KEY)
}
