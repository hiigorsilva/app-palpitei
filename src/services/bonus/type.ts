import type { IProximoNivel } from '../users/type'

export interface IBonusProgressResponse {
  userId: string
  name: string
  jogos_apostados: number
  total_jogos: number
  percentual: number
  nivel_atual: string
  bonus_concedido: number
  proximo_nivel: IProximoNivel | null
}

export type IGetBonusResponse = IBonusProgressResponse
export type IUpdateBonusResponse = IBonusProgressResponse

export interface IBonusNivel {
  nivel: string
  minimoPercentual: number
  bonusPontos: number
}

export type IListBonusNiveisResponse = IBonusNivel[]
