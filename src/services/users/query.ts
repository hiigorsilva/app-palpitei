import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  listCartaHistorico,
  listUserId,
  listUsers,
  updatePalpiteCampeao,
} from './api'
import type {
  ICartaHistoricoResponse,
  IPalpiteCampeaoResponse,
  IUser,
} from './type'

export function useListUsers() {
  return useQuery<IUser[], Error>({
    queryKey: ['users'],
    queryFn: listUsers,
  })
}

export function useGetUserId(userId: string | undefined) {
  return useQuery<IUser, Error>({
    queryKey: ['users', userId],
    queryFn: () => listUserId(userId!),
    enabled: Boolean(userId),
  })
}

export function useCartaHistorico(userId: string | undefined) {
  return useQuery<ICartaHistoricoResponse, Error>({
    queryKey: ['users', userId, 'carta-historico'],
    queryFn: () => listCartaHistorico(userId!),
    enabled: Boolean(userId),
  })
}

export function useUpdatePalpiteCampeao(userId: string) {
  const queryClient = useQueryClient()

  return useMutation<IPalpiteCampeaoResponse, Error, string>({
    mutationKey: ['palpite-campeao', userId],
    mutationFn: teamId => updatePalpiteCampeao(userId, teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', userId] })
      queryClient.invalidateQueries({ queryKey: ['grupos', userId] })
    },
  })
}
