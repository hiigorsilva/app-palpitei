import { api } from '@/lib/api'
import type {
  ICartaHistoricoResponse,
  IPalpiteCampeaoResponse,
  IUser,
} from './type'

export async function listUsers() {
  try {
    const res = await api.get<IUser[]>('/users')
    return res.data
  } catch (error) {
    console.error('Error listing users:', error)
    throw error
  }
}

export async function listUserId(userId: string) {
  try {
    const res = await api.get<IUser>(`/users/${userId}`)
    return res.data
  } catch (error) {
    console.error('Error listing user:', error)
    throw error
  }
}

export async function listCartaHistorico(userId: string) {
  try {
    const res = await api.get<ICartaHistoricoResponse>(
      `/users/${userId}/carta-historico`
    )
    return res.data
  } catch (error) {
    console.error('Error listing carta historico:', error)
    throw error
  }
}

export async function updatePalpiteCampeao(userId: string, teamId: string) {
  try {
    const res = await api.put<IPalpiteCampeaoResponse>(
      `/users/${userId}/palpite-campeao`,
      { teamId }
    )
    return res.data
  } catch (error) {
    console.error('Error updating palpite campeao:', error)
    throw error
  }
}
