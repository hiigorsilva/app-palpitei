import type { TPalpite } from '../type.utils'

export interface IUserBasic {
  id: string
  name: string
  carta_dobro_pontos: number
  created_at: string | null
}

export type IAuthLoginResponse = IUserBasic
export type ICreateUserResponse = IUserBasic

export interface IProximoNivel {
  nivel: string
  bonusPontos: number
  minimoPercentual: number
}

export interface IUser {
  id: string
  name: string
  carta_dobro_pontos: number
  created_at: string | null
  bonus_concedido: number
  jogos_apostados: number
  nivel_atual: string
  percentual: number
  proximo_nivel: IProximoNivel | null
  total_jogos: number
}

export type IListUsersResponse = IUser[]
export type IGetUserResponse = IUser

export interface IPalpiteCampeaoResponse {
  id: number
  userId: string
  teamId: string
  teamName: string
  acertou: boolean
  pontos: number
  created_at: string | null
  updated_at: string | null
}

export interface ICartaHistoricoItem {
  gameId: string
  team_a: string
  team_b: string
  data_hora: string
  palpite: TPalpite
  acertou: boolean
  pontos: number
}

export type ICartaHistoricoResponse = ICartaHistoricoItem[]
