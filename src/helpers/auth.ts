const STORAGE_KEY = '@auth'

type AuthData = {
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
