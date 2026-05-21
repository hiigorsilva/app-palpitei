import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createGameBet, listBetsByUserId, updateGameBet } from './api'
import type {
  IBetExpanded,
  ICreateBetPayload,
  ICreateBetResponse,
} from './type'

export function useGetBetsByUserId(userId: string | undefined) {
  return useQuery<IBetExpanded[], Error>({
    queryKey: ['bets', userId],
    queryFn: () => listBetsByUserId(userId!),
    enabled: Boolean(userId),
  })
}

export function useCreateGameBet(userId: string, gameId: string) {
  const queryClient = useQueryClient()

  return useMutation<ICreateBetResponse, Error, ICreateBetPayload>({
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

  return useMutation<ICreateBetResponse, Error, ICreateBetPayload>({
    mutationFn: payload => updateGameBet(userId, betId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bets'] })
      queryClient.invalidateQueries({ queryKey: ['bets', userId] })
      queryClient.invalidateQueries({ queryKey: ['users', userId] })
    },
  })
}
