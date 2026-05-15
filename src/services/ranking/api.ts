import { api } from '@/lib/api'
import type { RankingData } from './type'

export async function getStatisticsUser(userId: string) {
  try {
    const res = await api.get<RankingData>(`/ranking/users/${userId}`)
    return res.data
  } catch (error) {
    console.error('Error getting user statistics:', error)
    throw error
  }
}
