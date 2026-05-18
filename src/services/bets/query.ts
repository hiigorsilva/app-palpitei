import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createGameBet, listBetsByUserId, updateGameBet } from './api'
import type { CreateBetInput, IBet, ICreateBet } from './type'

export function useGetBetsByUserId(userId: string) {
  return useQuery<IBet[], Error>({
    queryKey: ['bets', userId],
    queryFn: () => listBetsByUserId(userId),
  })
}

export function useCreateGameBet(userId: string, gameId: string) {
  const queryClient = useQueryClient()

  return useMutation<ICreateBet, Error, CreateBetInput>({
    mutationFn: payload => createGameBet(userId, gameId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bets'] })
      queryClient.invalidateQueries({ queryKey: ['bets', userId] })
      queryClient.invalidateQueries({ queryKey: ['users', userId] })
    },
  })
}

export function useUpdateGameBet(userId: string, betId: string) {
  const queryClient = useQueryClient()

  return useMutation<ICreateBet, Error, CreateBetInput>({
    mutationFn: payload => updateGameBet(userId, betId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bets'] })
      queryClient.invalidateQueries({ queryKey: ['bets', userId] })
      queryClient.invalidateQueries({ queryKey: ['users', userId] })
    },
  })
}
