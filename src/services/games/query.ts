import { useQuery } from '@tanstack/react-query'
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
} from './api'
import type { IGame } from './type'

export type IGameFilters = {
  fase?: string
  status?: string
}

export function useListDailyGames(filters?: IGameFilters) {
  return useQuery<IGame[], Error>({
    queryKey: ['games', 'daily'],
    queryFn: () => listDailyGames(filters),
  })
}

export function useListGames(filters?: IGameFilters) {
  return useQuery<IGame[], Error>({
    queryKey: ['games', filters],
    queryFn: () => listGames(filters),
  })
}

export function useListFase16AvosGames() {
  return useQuery<IGame[], Error>({
    queryKey: ['games', { fase: '16_AVOS' }],
    queryFn: () => listFase16AvosGames(),
  })
}

export function useListFaseOitavasGames() {
  return useQuery<IGame[], Error>({
    queryKey: ['games', { fase: 'OITAVAS' }],
    queryFn: () => listFaseOitavasGames(),
  })
}

export function useListFaseQuartasGames() {
  return useQuery<IGame[], Error>({
    queryKey: ['games', { fase: 'QUARTAS' }],
    queryFn: () => listFaseQuartasGames(),
  })
}

export function useListFaseSemiGames() {
  return useQuery<IGame[], Error>({
    queryKey: ['games', { fase: 'SEMI' }],
    queryFn: () => listFaseSemiGames(),
  })
}

export function useListFaseTerceiroGames() {
  return useQuery<IGame[], Error>({
    queryKey: ['games', { fase: 'TERCEIRO' }],
    queryFn: () => listFaseTerceiroGames(),
  })
}

export function useListFaseFinalGames() {
  return useQuery<IGame[], Error>({
    queryKey: ['games', { fase: 'FINAL' }],
    queryFn: () => listFaseFinalGames(),
  })
}

export function useGetGameId(gameId: string) {
  return useQuery<IGame, Error>({
    queryKey: ['games', gameId],
    queryFn: () => listGameById(gameId),
  })
}
