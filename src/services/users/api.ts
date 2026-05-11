import { api } from '@/lib/api'
import type { IUser } from './type'

export async function listUsers() {
  try {
    const res = await api.get<IUser[]>('/users')
    return res.data
  } catch (error) {
    console.error('Error listing users:', error)
    throw error
  }
}

export async function listUserId(userId: string) {
  try {
    const res = await api.get<IUser>(`/users/${userId}`)
    return res.data
  } catch (error) {
    console.error('Error listing user:', error)
    throw error
  }
}
