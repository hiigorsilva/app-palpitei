import { api } from '@/lib/api'
import type { IGrupo } from './type'

export async function listGrupos() {
  try {
    const res = await api.get<IGrupo[]>('/teams')
    return res.data
  } catch (error) {
    console.error('Error listing grupos:', error)
    throw error
  }
}
