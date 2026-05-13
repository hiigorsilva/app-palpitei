import { api } from '@/lib/api'
import type { IGameFilters } from './query'
import type { IGame } from './type'

export async function listNextGames(userId: string) {
  try {
    const res = await api.get<IGame[]>('/games/pendentes', {
      params: { userId },
    })
    return res.data
  } catch (error) {
    console.error('Error listing next games:', error)
    throw error
  }
}

export async function listDailyGames(userId: string, filters?: IGameFilters) {
  try {
    const res = await api.get<IGame[]>('/games/hoje', {
      params: { ...filters, userId },
    })
    return res.data
  } catch (error) {
    console.error('Error listing daily games:', error)
    throw error
  }
}

export async function listGames(userId: string, filters?: IGameFilters) {
  try {
    const res = await api.get<IGame[]>('/games', {
      params: { ...filters, userId },
    })
    return res.data
  } catch (error) {
    console.error('Error listing games:', error)
    throw error
  }
}

export async function listFase16AvosGames(userId: string) {
  try {
    const res = await api.get<IGame[]>('/games', {
      params: { fase: '16_AVOS', status: 'FUTURO', userId },
    })
    return res.data
  } catch (error) {
    console.error('Error listing 16 avos games:', error)
    throw error
  }
}

export async function listFaseOitavasGames(userId: string) {
  try {
    const res = await api.get<IGame[]>('/games', {
      params: { fase: 'OITAVAS', status: 'FUTURO', userId },
    })
    return res.data
  } catch (error) {
    console.error('Error listing oitavas games:', error)
    throw error
  }
}

export async function listFaseQuartasGames(userId: string) {
  try {
    const res = await api.get<IGame[]>('/games', {
      params: { fase: 'QUARTAS', status: 'FUTURO', userId },
    })
    return res.data
  } catch (error) {
    console.error('Error listing quartas games:', error)
    throw error
  }
}

export async function listFaseSemiGames(userId: string) {
  try {
    const res = await api.get<IGame[]>('/games', {
      params: { fase: 'SEMI', status: 'FUTURO', userId },
    })
    return res.data
  } catch (error) {
    console.error('Error listing semi games:', error)
    throw error
  }
}

export async function listFaseTerceiroGames(userId: string) {
  try {
    const res = await api.get<IGame[]>('/games', {
      params: { fase: 'TERCEIRO', status: 'FUTURO', userId },
    })
    return res.data
  } catch (error) {
    console.error('Error listing terceiro games:', error)
    throw error
  }
}

export async function listFaseFinalGames(userId: string) {
  try {
    const res = await api.get<IGame[]>('/games', {
      params: { fase: 'FINAL', status: 'FUTURO', userId },
    })
    return res.data
  } catch (error) {
    console.error('Error listing final games:', error)
    throw error
  }
}

export async function listGameById(gameId: string, userId: string) {
  try {
    const res = await api.get<IGame>(`/games/${gameId}`, {
      params: { userId },
    })
    return res.data
  } catch (error) {
    console.error(`Error listing game by ID ${gameId}:`, error)
    throw error
  }
}
