const STORAGE_KEY = '@palpitei:auth'
const ADMIN_STORAGE_KEY = '@palpitei:admin-auth'

type AuthData = {
  id: string
  name: string
  created_at: string
}

type AdminAuthData = {
  username: string
  password: string
}

export function getStorageAuth(): AuthData | null {
  if (typeof window === 'undefined') return null

  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) return null

  try {
    return JSON.parse(data) as AuthData
  } catch {
    return null
  }
}

export function setStorageAuth(data: AuthData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function removeStorageAuth() {
  localStorage.removeItem(STORAGE_KEY)
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
