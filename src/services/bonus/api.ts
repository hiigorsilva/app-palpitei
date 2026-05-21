import { api } from '@/lib/api'
import type { IListBonusNiveisResponse } from './type'

export async function listNiveisBonus() {
  try {
    const res = await api.get<IListBonusNiveisResponse>('/bonus/niveis')
    return res.data
  } catch (error) {
    console.error('Error listing bonus levels:', error)
    throw error
  }
}
