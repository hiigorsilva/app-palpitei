import { api } from '@/lib/api'
import type { IGetBonusResponse, IListBonusNiveisResponse } from './type'

export async function getBonusUser(userId: string) {
  try {
    const res = await api.get<IGetBonusResponse>(`/bonus/users/${userId}`)
    return res.data
  } catch (error) {
    console.error('Error getting bonus progress:', error)
    throw error
  }
}

export async function listNiveisBonus() {
  try {
    const res = await api.get<IListBonusNiveisResponse>('/bonus/niveis')
    return res.data
  } catch (error) {
    console.error('Error listing bonus levels:', error)
    throw error
  }
}
