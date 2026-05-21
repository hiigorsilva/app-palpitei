import { useQuery } from '@tanstack/react-query'
import { listGrupos } from './api'
import type { IListTeamsResponse } from './type'

export function useListGrupos(userId?: string) {
  return useQuery<IListTeamsResponse, Error>({
    queryKey: ['grupos', userId],
    queryFn: () => listGrupos(userId!),
    enabled: Boolean(userId),
  })
}
