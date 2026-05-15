import { api } from '@/lib/api'
import type { IBet, ICreateBet } from './type'

export async function listBetsByUserId(userId: string) {
  try {
    const res = await api.get<IBet[]>(`/users/${userId}/bets`)
    return res.data
  } catch (error) {
    console.error('Error listing bets by user ID:', error)
    throw error
  }
}

export async function createGameBet(userId: string, gameId: string) {
  try {
    const res = await api.post<ICreateBet>(
      `/users/${userId}/games/${gameId}/bets`
    )
    return res.data
  } catch (error) {
    console.error('Error creating game bet:', error)
    throw error
  }
}
