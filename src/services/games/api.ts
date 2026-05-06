import { api } from '@/lib/api'
import type { IGameFilters } from './query'
import type { IGame } from './type'

export async function listGames(filters?: IGameFilters) {
  try {
    const res = await api.get<IGame[]>('/games', { params: filters })
    return res.data
  } catch (error) {
    console.error('Error listing games:', error)
    throw error
  }
}

export async function listFase16AvosGames() {
  try {
    const res = await api.get<IGame[]>('/games', {
      params: { fase: '32_AVOS', status: 'FUTURO' },
    })
    return res.data
  } catch (error) {
    console.error('Error listing 16 avos games:', error)
    throw error
  }
}

export async function listFaseOitavasGames() {
  try {
    const res = await api.get<IGame[]>('/games', {
      params: { fase: 'OITAVAS', status: 'FUTURO' },
    })
    return res.data
  } catch (error) {
    console.error('Error listing oitavas games:', error)
    throw error
  }
}

export async function listFaseQuartasGames() {
  try {
    const res = await api.get<IGame[]>('/games', {
      params: { fase: 'QUARTAS', status: 'FUTURO' },
    })
    return res.data
  } catch (error) {
    console.error('Error listing quartas games:', error)
    throw error
  }
}

export async function listFaseSemiGames() {
  try {
    const res = await api.get<IGame[]>('/games', {
      params: { fase: 'SEMI', status: 'FUTURO' },
    })
    return res.data
  } catch (error) {
    console.error('Error listing semi games:', error)
    throw error
  }
}

export async function listFaseFinalGames() {
  try {
    const res = await api.get<IGame[]>('/games', {
      params: { fase: 'FINAL', status: 'FUTURO' },
    })
    return res.data
  } catch (error) {
    console.error('Error listing final games:', error)
    throw error
  }
}
