import { useQuery } from '@tanstack/react-query'
import { listNiveisBonus } from './api'
import type { INivelBonus } from './type'

export function useListNiveisBonus() {
  return useQuery<INivelBonus[], Error>({
    queryKey: ['bonusNiveis'],
    queryFn: () => listNiveisBonus(),
  })
}
