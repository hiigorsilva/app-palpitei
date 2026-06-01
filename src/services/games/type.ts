import type { ITeamInfo } from '../grupos/type'
import type { TFase } from '../type.utils'

export interface IGame {
  id: string
  team_a: string
  team_b: string
  team_a_info: ITeamInfo | null
  team_b_info: ITeamInfo | null
  fase: TFase | string
  data_hora: string
  gols_a: number | null
  gols_b: number | null
  finish_game: boolean
  has_palpite: boolean
  usou_carta_dobro_pontos: boolean
  created_at: string
  updated_at: string
}

export type IListGamesResponse = IGame[]
export type IListPendentesResponse = IGame[]
export type IListHojeResponse = IGame[]

export type IGetGameResponse = IGame
