import { useQuery } from '@tanstack/react-query'
import { listGames } from './api'
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
