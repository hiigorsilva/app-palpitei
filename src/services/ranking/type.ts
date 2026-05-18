export interface RankingData {
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
  palpite_campeao: {
    teamId: string
    name: string
    code: string
    flag: string
    acertou: boolean
    pontos: number
  }
}

export interface IRanking {
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
