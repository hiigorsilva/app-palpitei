export type IGame = {
  id: string
  team_a: string
  team_b: string
  fase: string
  data_hora: string
  gols_a: number | null
  gols_b: number | null
  finish_game: boolean
  has_palpites: boolean
  created_at: string
  updated_at: string
}
