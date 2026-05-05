import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { IGame } from './type'

export type IGameFilters = {
  fase?: string
  status?: string
}

export function useListGames(filters?: IGameFilters) {
  return useQuery<IGame[], Error>({
    queryKey: ['games', filters],
    queryFn: () => listGames(filters),
  })
}

export async function listGames(filters?: IGameFilters) {
  try {
    const res = await api.get<IGame[]>('/games', { params: filters })
    return res.data
  } catch (error) {
    console.error('Error listing games:', error)
    throw error
  }
}
