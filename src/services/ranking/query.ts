import { useQuery } from '@tanstack/react-query'
import { getRanking, getStatisticsUser } from './api'
import type { IRanking, RankingData } from './type'

export function useStatistics(userId: string) {
  return useQuery<RankingData, Error>({
    queryKey: ['ranking', userId],
    queryFn: () => getStatisticsUser(userId),
  })
}

export function useRanking() {
  return useQuery<IRanking[], Error>({
    queryKey: ['ranking'],
    queryFn: getRanking,
  })
}
