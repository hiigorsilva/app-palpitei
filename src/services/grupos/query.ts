import { useQuery } from '@tanstack/react-query'
import { listGrupos } from './api'
import type { IGrupo } from './type'

export function useListGrupos(userId?: string) {
  return useQuery<IGrupo[], Error>({
    queryKey: ['grupos', userId],
    queryFn: () => listGrupos(userId!),
    enabled: Boolean(userId),
  })
}
