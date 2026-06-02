import { useQuery } from '@tanstack/react-query'
import { getBonusUser, listNiveisBonus } from './api'
import type { IGetBonusResponse, IListBonusNiveisResponse } from './type'

export function useGetBonusUser(userId: string | undefined) {
  return useQuery<IGetBonusResponse, Error>({
    queryKey: ['bonus', userId],
    queryFn: () => getBonusUser(userId!),
    enabled: Boolean(userId),
  })
}

export function useListNiveisBonus() {
  return useQuery<IListBonusNiveisResponse, Error>({
    queryKey: ['bonusNiveis'],
    queryFn: () => listNiveisBonus(),
  })
}
