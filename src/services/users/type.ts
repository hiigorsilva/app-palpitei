export interface IUser {
  id: string
  name: string
  created_at: string
  carta_dobro_pontos: number
  bonus_concedido: number
  jogos_apostados: number
  nivel_atual: string
  percentual: number
  proximo_nivel: {
    nivel: string
    bonusPontos: number
    minimoPercentual: number
  }
  total_jogos: number
}
