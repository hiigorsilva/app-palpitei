import { useQuery } from '@tanstack/react-query'
import { listGrupos } from './api'
import type { IGrupo } from './type'

export function useListGrupos() {
  return useQuery<IGrupo[], Error>({
    queryKey: ['grupos'],
    queryFn: () => listGrupos(),
  })
}
