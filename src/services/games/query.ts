import { useQuery } from '@tanstack/react-query'
import { DateNow } from '@/helpers/date'
import {
  listDailyGames,
  listFase16AvosGames,
  listFaseFinalGames,
  listFaseOitavasGames,
  listFaseQuartasGames,
  listFaseSemiGames,
  listFaseTerceiroGames,
  listGameById,
  listGames,
  listNextGames,
} from './api'
import type { IGame } from './type'

export type IGameFilters = {
  fase?: string
  status?: string
}

export function useListDailyGames(userId?: string, filters?: IGameFilters) {
  return useQuery<IGame[], Error>({
    queryKey: ['games', 'daily', userId, filters],
    queryFn: () => listDailyGames(userId!, filters),
    enabled: Boolean(userId),
  })
}

export function useNextGames(userId?: string) {
  const nextGames = useQuery<IGame[], Error>({
    queryKey: ['games', 'next', userId],
    queryFn: () => listNextGames(userId!),
    enabled: Boolean(userId),
  })
  const data = nextGames.data
    ?.filter(match => new Date(match.data_hora) > DateNow())
    .sort(
      (a, b) =>
        new Date(a.data_hora).getTime() - new Date(b.data_hora).getTime()
    )
    .slice(0, 7)
  return { ...nextGames, data }
}

export function useListGames(userId?: string, filters?: IGameFilters) {
  return useQuery<IGame[], Error>({
    queryKey: ['games', userId, filters],
    queryFn: () => listGames(userId!, filters),
    enabled: Boolean(userId),
  })
}

export function useListFase16AvosGames(userId?: string) {
  return useQuery<IGame[], Error>({
    queryKey: ['games', userId, { fase: '16_AVOS' }],
    queryFn: () => listFase16AvosGames(userId!),
    enabled: Boolean(userId),
  })
}

export function useListFaseOitavasGames(userId?: string) {
  return useQuery<IGame[], Error>({
    queryKey: ['games', userId, { fase: 'OITAVAS' }],
    queryFn: () => listFaseOitavasGames(userId!),
    enabled: Boolean(userId),
  })
}

export function useListFaseQuartasGames(userId?: string) {
  return useQuery<IGame[], Error>({
    queryKey: ['games', userId, { fase: 'QUARTAS' }],
    queryFn: () => listFaseQuartasGames(userId!),
    enabled: Boolean(userId),
  })
}

export function useListFaseSemiGames(userId?: string) {
  return useQuery<IGame[], Error>({
    queryKey: ['games', userId, { fase: 'SEMI' }],
    queryFn: () => listFaseSemiGames(userId!),
    enabled: Boolean(userId),
  })
}

export function useListFaseTerceiroGames(userId?: string) {
  return useQuery<IGame[], Error>({
    queryKey: ['games', userId, { fase: 'TERCEIRO' }],
    queryFn: () => listFaseTerceiroGames(userId!),
    enabled: Boolean(userId),
  })
}

export function useListFaseFinalGames(userId?: string) {
  return useQuery<IGame[], Error>({
    queryKey: ['games', userId, { fase: 'FINAL' }],
    queryFn: () => listFaseFinalGames(userId!),
    enabled: Boolean(userId),
  })
}

export function useGetGameId(gameId: string, userId?: string) {
  return useQuery<IGame, Error>({
    queryKey: ['games', gameId, userId],
    queryFn: () => listGameById(gameId, userId!),
    enabled: Boolean(gameId && userId),
  })
}
