import { api } from '@/lib/api'
import type { IBet } from './type'

export async function listBetsByUserId(userId: string) {
  try {
    const res = await api.get<IBet[]>(`/users/${userId}/bets`)
    return res.data
  } catch (error) {
    console.error('Error listing bets by user ID:', error)
    throw error
  }
}
