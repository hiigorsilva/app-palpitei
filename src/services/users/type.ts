export interface IUser {
  id: string
  name: string
  created_at: string
}

export interface IUserBonus {
  userId: string
  name: string
  jogos_apostados: number
  total_jogos: number
  percentual: number
  nivel_atual: string
  bonus_concedido: number
  proximo_nivel: {
    nivel: string
    minimoPercentual: number
    bonusPontos: number
  }
}
