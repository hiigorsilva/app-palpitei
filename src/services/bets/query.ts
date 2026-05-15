import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createGameBet, listBetsByUserId } from './api'
import type { IBet, ICreateBet } from './type'

export function useGetBetsByUserId(userId: string) {
  return useQuery<IBet[], Error>({
    queryKey: ['bets', userId],
    queryFn: () => listBetsByUserId(userId),
  })
}

export function useCreateGameBet(userId: string, gameId: string) {
  const queryClient = useQueryClient()

  return useMutation<ICreateBet, Error>({
    mutationFn: () => createGameBet(userId, gameId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bets'] })
    },
  })
}
