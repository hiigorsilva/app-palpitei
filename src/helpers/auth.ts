const STORAGE_KEY = '@palpitei:auth'

type AuthData = {
  id: string
  name: string
  created_at: string
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
