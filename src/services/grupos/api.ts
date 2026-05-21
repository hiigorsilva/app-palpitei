import { api } from '@/lib/api'
import type { IListTeamsResponse } from './type'

export async function listGrupos(userId: string) {
  try {
    const res = await api.get<IListTeamsResponse>('/teams', {
      params: { userId },
    })
    return res.data
  } catch (error) {
    console.error('Error listing grupos:', error)
    throw error
  }
}
