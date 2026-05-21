import { useQuery } from '@tanstack/react-query'
import { listNiveisBonus } from './api'
import type { IListBonusNiveisResponse } from './type'

export function useListNiveisBonus() {
  return useQuery<IListBonusNiveisResponse, Error>({
    queryKey: ['bonusNiveis'],
    queryFn: () => listNiveisBonus(),
  })
}
