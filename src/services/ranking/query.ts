import { useQuery } from '@tanstack/react-query'
import { getRanking, getStatisticsUser } from './api'
import type { IRankingPontosResponse, IRankingUserStatsResponse } from './type'

export function useStatistics(userId: string) {
  return useQuery<IRankingUserStatsResponse, Error>({
    queryKey: ['ranking', userId],
    queryFn: () => getStatisticsUser(userId),
  })
}

export function useRanking() {
  return useQuery<IRankingPontosResponse, Error>({
    queryKey: ['ranking'],
    queryFn: getRanking,
  })
}
