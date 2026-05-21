import type { ITeamInfo } from '../grupos/type'
import type { TPalpite } from '../type.utils'

export interface IBetSimple {
  id: number
  userId: string
  gameId: string
  palpite: TPalpite
  acertou: boolean
  pontos: number
  usou_carta_dobro_pontos: boolean
  carta_dobro_pontos?: number
  created_at: string
  updated_at: string
}

export interface ICreateBetPayload {
  palpite: TPalpite
  usou_carta_dobro_pontos: boolean
}

/** PUT /api/games/{id}/users/{userId}/palpite — 200 */
export type ICreateBetResponse = IBetSimple

/** Aposta expandida com dados do jogo (usada em listagens) */
export interface IBetExpanded extends IBetSimple {
  username: string
  team_a: string
  team_b: string
  team_a_info: ITeamInfo | null
  team_b_info: ITeamInfo | null
  data_hora: string
  gols_a: number | null
  gols_b: number | null
  finish_game: boolean
}

/** GET /api/users/{userId}/bets — 200 (array) */
export type IListUserBetsResponse = IBetExpanded[]
