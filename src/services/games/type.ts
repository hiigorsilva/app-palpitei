export interface IGame {
  id: string
  team_a: string
  team_b: string
  team_a_info: ITeamDetails | null
  team_b_info: ITeamDetails | null
  fase: string
  data_hora: string
  gols_a: number | null
  gols_b: number | null
  has_palpite: boolean
  finish_game: boolean
  created_at: Date
  updated_at: Date
}

export interface ITeamDetails {
  id: string
  name: string
  flag: string | null
  continent: string | null
  flag_icon: string | null
  flag_unicode: string | null
  fifa_code: string | null
  group: Grupo
  confed: string | null
  isPalpiteCampeao: boolean
}

type Grupo =
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
