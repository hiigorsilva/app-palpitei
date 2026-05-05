import { api } from '@/lib/api'
import type { IGameFilters } from './query'
import type { IGame } from './type'

export async function listGames(filters?: IGameFilters) {
  try {
    const res = await api.get<IGame[]>('/games', { params: filters })
    return res.data
  } catch (error) {
    console.error('Error listing games:', error)
    throw error
  }
}
