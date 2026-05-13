import type { ITeamDetails } from '../games/type'

export interface IBet {
  id: string
  userId: string
  gameId: string
  palpite: 'A' | 'B' | 'EMPATE'
  acertou: boolean
  created_at: string
  updated_at: string
  username: string
  team_a: string
  team_b: string
  data_hora: string
  gols_a: number | null
  gols_b: number | null
  finish_game: boolean
  team_a_info: ITeamDetails | null
  team_b_info: ITeamDetails | null
}
