import { api } from '@/lib/api'
import type { INivelBonus } from './type'

export async function listNiveisBonus() {
  try {
    const res = await api.get<INivelBonus[]>('/bonus/niveis')
    return res.data
  } catch (error) {
    console.error('Error listing bonus levels:', error)
    throw error
  }
}
