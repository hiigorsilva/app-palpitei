import { useQuery } from '@tanstack/react-query'
import { getStatisticsUser } from './api'
import type { RankingData } from './type'

export function useStatistics(userId: string) {
  return useQuery<RankingData, Error>({
    queryKey: ['ranking', userId],
    queryFn: () => getStatisticsUser(userId),
  })
}
