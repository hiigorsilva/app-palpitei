import { api } from '@/lib/api'
import type { CreateBetInput, IBet, ICreateBet } from './type'

export async function listBetsByUserId(userId: string) {
  try {
    const res = await api.get<IBet[]>(`/users/${userId}/bets`)
    return res.data
  } catch (error) {
    console.error('Error listing bets by user ID:', error)
    throw error
  }
}

export async function createGameBet(
  userId: string,
  gameId: string,
  payload: CreateBetInput
) {
  try {
    const res = await api.post<ICreateBet>(
      `/users/${userId}/games/${gameId}/bets`,
      payload
    )
    return res.data
  } catch (error) {
    console.error('Error creating game bet:', error)
    throw error
  }
}
