import { api } from '@/lib/api'
import type {
  ICreateBetPayload,
  ICreateBetResponse,
  IListUserBetsResponse,
  IUpdateBetPayload,
} from './type'

export async function listBetsByUserId(userId: string) {
  try {
    const res = await api.get<IListUserBetsResponse>(`/users/${userId}/bets`)
    return res.data
  } catch (error) {
    console.error('Error listing bets by user ID:', error)
    throw error
  }
}

export async function createGameBet(
  userId: string,
  gameId: string,
  payload: ICreateBetPayload
) {
  try {
    const res = await api.post<ICreateBetResponse>(
      `/users/${userId}/games/${gameId}/bets`,
      payload
    )
    return res.data
  } catch (error) {
    console.error('Error creating game bet:', error)
    throw error
  }
}

export async function updateGameBet(
  userId: string,
  betId: string,
  payload: IUpdateBetPayload
) {
  try {
    const res = await api.put<ICreateBetResponse>(
      `/bets/${betId}/users/${userId}`,
      payload
    )
    return res.data
  } catch (error) {
    console.error('Error updating game bet:', error)
    throw error
  }
}
