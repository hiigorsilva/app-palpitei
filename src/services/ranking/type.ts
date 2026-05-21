export interface IRankingItem {
  position: number
  userId: string
  name: string
  pontos_total: number
  pontos_apostas: number
  pontos_bonus: number
  pontos_campeao: number
  acertos: number
  total_apostas: number
  taxa_acerto: number
}

export type IRankingPontosResponse = IRankingItem[]
export type IRankingTaxaResponse = IRankingItem[]

export interface IRankingUserPositionResponse {
  position: number
  total_usuarios: number
}

export interface IPalpiteCampeaoStats {
  teamId: string
  name: string
  code: string | null
  flag: string | null
  acertou: boolean
  pontos: number
}

export interface IRankingUserStatsResponse extends IRankingItem {
  palpite_campeao: IPalpiteCampeaoStats | null
}
