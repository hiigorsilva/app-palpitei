import { api } from '@/lib/api'
import type { IUser } from '../users/type'
import type { CreateUserInput } from './query'

export async function createUser(data: CreateUserInput) {
  try {
    const res = await api.post<IUser>('/auth/login', data)
    return res.data
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}
