import { useQuery } from '@tanstack/react-query'
import { listBetsByUserId } from './api'
import type { IBet } from './type'

export function useGetBetsByUserId(userId: string) {
  return useQuery<IBet[], Error>({
    queryKey: ['bets', userId],
    queryFn: () => listBetsByUserId(userId),
  })
}
