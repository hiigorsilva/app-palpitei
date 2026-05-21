import { api } from '@/lib/api'
import type { IRankingPontosResponse, IRankingUserStatsResponse } from './type'

export async function getStatisticsUser(userId: string) {
  try {
    const res = await api.get<IRankingUserStatsResponse>(
      `/ranking/users/${userId}`
    )
    return res.data
  } catch (error) {
    console.error('Error getting user statistics:', error)
    throw error
  }
}

export async function getRanking() {
  try {
    const res = await api.get<IRankingPontosResponse>('/ranking/pontos')
    return res.data
  } catch (error) {
    console.error('Error getting user ranking:', error)
    throw error
  }
}
