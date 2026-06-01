import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getStorageAuth, setStorageAuth } from '@/helpers/auth'
import type { IUser } from '../users/type'
import { createGameBet, listBetsByUserId, updateGameBet } from './api'
import type {
  IBetExpanded,
  ICreateBetPayload,
  ICreateBetResponse,
  IUpdateBetPayload,
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
    onSuccess: data => {
      syncUserDoubleCards(queryClient, userId, data.carta_dobro_pontos)
      queryClient.invalidateQueries({ queryKey: ['bets'] })
      queryClient.invalidateQueries({ queryKey: ['bets', userId] })
      queryClient.invalidateQueries({ queryKey: ['users', userId] })
      queryClient.invalidateQueries({ queryKey: ['games'] })
    },
  })
}

export function useUpdateGameBet(userId: string, betId: string) {
  const queryClient = useQueryClient()

  return useMutation<ICreateBetResponse, Error, IUpdateBetPayload>({
    mutationFn: payload => updateGameBet(userId, betId, payload),
    onSuccess: data => {
      syncUserDoubleCards(queryClient, userId, data.carta_dobro_pontos)
      queryClient.invalidateQueries({ queryKey: ['bets'] })
      queryClient.invalidateQueries({ queryKey: ['bets', userId] })
      queryClient.invalidateQueries({ queryKey: ['users', userId] })
      queryClient.invalidateQueries({ queryKey: ['games'] })
    },
  })
}

function syncUserDoubleCards(
  queryClient: ReturnType<typeof useQueryClient>,
  userId: string,
  cartaDobroPontos?: number
) {
  if (cartaDobroPontos === undefined) return

  queryClient.setQueryData<IUser>(['users', userId], oldUser =>
    oldUser
      ? {
          ...oldUser,
          carta_dobro_pontos: cartaDobroPontos,
        }
      : oldUser
  )

  const storageUser = getStorageAuth()
  if (storageUser?.id === userId) {
    setStorageAuth({
      ...storageUser,
      carta_dobro_pontos: cartaDobroPontos,
    })
  }
}
