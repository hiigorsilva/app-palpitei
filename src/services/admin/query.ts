import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  apurarCampeao,
  atualizarParticipantesJogo,
  atualizarParticipantesLote,
  corrigirResultado,
  getAdminDashboard,
  inserirResultado,
  inserirResultadosLote,
  popularBaseLocal,
  recalcularPontuacao,
} from './api'
import type {
  IAdminCampeaoResponse,
  IAdminCorrigirResultadoResponse,
  IAdminDashboardResponse,
  IAdminParticipantesLoteResponse,
  IAdminParticipantesResponse,
  IAdminPopularBaseResponse,
  IAdminRecalcularResponse,
  IAdminResultadoResponse,
  IAdminResultadosLoteResponse,
  IAtualizarParticipantesLotePayload,
  IAtualizarParticipantesPayload,
  ICorrigirResultadoPayload,
  ILoteResultadosPayload,
  IResultadoPayload,
} from './type'

export function useAdminDashboard(enabled: boolean) {
  return useQuery<IAdminDashboardResponse, Error>({
    queryKey: ['admin', 'dashboard'],
    queryFn: getAdminDashboard,
    enabled,
  })
}

export function useCorrigirResultado() {
  const queryClient = useQueryClient()

  return useMutation<
    IAdminCorrigirResultadoResponse,
    Error,
    { gameId: string; payload: ICorrigirResultadoPayload }
  >({
    mutationFn: ({ gameId, payload }) => corrigirResultado(gameId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] })
      queryClient.invalidateQueries({ queryKey: ['games'] })
      queryClient.invalidateQueries({ queryKey: ['ranking'] })
    },
  })
}

export function useAtualizarParticipantesJogo() {
  const queryClient = useQueryClient()

  return useMutation<
    IAdminParticipantesResponse,
    Error,
    { gameId: string; payload: IAtualizarParticipantesPayload }
  >({
    mutationFn: ({ gameId, payload }) =>
      atualizarParticipantesJogo(gameId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] })
      queryClient.invalidateQueries({ queryKey: ['games'] })
    },
  })
}

export function useAtualizarParticipantesLote() {
  const queryClient = useQueryClient()

  return useMutation<
    IAdminParticipantesLoteResponse,
    Error,
    IAtualizarParticipantesLotePayload
  >({
    mutationFn: atualizarParticipantesLote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] })
      queryClient.invalidateQueries({ queryKey: ['games'] })
    },
  })
}

export function useRecalcularPontuacao() {
  const queryClient = useQueryClient()

  return useMutation<IAdminRecalcularResponse, Error>({
    mutationFn: recalcularPontuacao,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] })
      queryClient.invalidateQueries({ queryKey: ['ranking'] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export function useApurarCampeao() {
  const queryClient = useQueryClient()

  return useMutation<IAdminCampeaoResponse, Error, string>({
    mutationFn: apurarCampeao,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] })
      queryClient.invalidateQueries({ queryKey: ['ranking'] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export function useInserirResultadosLote() {
  const queryClient = useQueryClient()

  return useMutation<
    IAdminResultadosLoteResponse,
    Error,
    ILoteResultadosPayload
  >({
    mutationFn: inserirResultadosLote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] })
      queryClient.invalidateQueries({ queryKey: ['games'] })
      queryClient.invalidateQueries({ queryKey: ['ranking'] })
    },
  })
}

export function useInserirResultado() {
  const queryClient = useQueryClient()

  return useMutation<IAdminResultadoResponse, Error, IResultadoPayload>({
    mutationFn: inserirResultado,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] })
      queryClient.invalidateQueries({ queryKey: ['games'] })
      queryClient.invalidateQueries({ queryKey: ['ranking'] })
    },
  })
}

export function usePopularBaseLocal() {
  const queryClient = useQueryClient()

  return useMutation<IAdminPopularBaseResponse, Error>({
    mutationFn: popularBaseLocal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] })
      queryClient.invalidateQueries({ queryKey: ['games'] })
      queryClient.invalidateQueries({ queryKey: ['teams'] })
    },
  })
}
