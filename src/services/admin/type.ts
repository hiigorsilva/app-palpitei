export interface IAdminDashboard {
  total_usuarios: number
  total_apostas: number
  total_jogos: number
  jogos_encerrados: number
  jogos_pendentes: number
  usuarios_com_apostas: number
  media_apostas_por_usuario: number
}

export interface IAdminMessageResponse {
  message: string
}

export interface IRecalcularPontuacaoResponse extends IAdminMessageResponse {
  usuarios_atualizados: number
  apostas_processadas: number
}

export interface IApurarCampeaoResponse extends IAdminMessageResponse {
  campeao: string
  pontos: number
  palpites_corretos: number
}

export interface IPopularBaseResponse {
  teams_inseridos: number
  teams_ignorados: number
  jogos_inseridos: number
  jogos_atualizados: number
  jogos_ignorados: number
}

export interface IResultadoPayload {
  gameId: string
  gols_a: number
  gols_b: number
}

export type ICorrigirResultadoPayload = Omit<IResultadoPayload, 'gameId'>

export interface ILoteResultadosPayload {
  resultados: IResultadoPayload[]
}

export interface IAtualizarParticipantesPayload {
  team_a: string
  team_b: string
}

export interface IAtualizarParticipantesLotePayload {
  jogos: Array<{
    gameId: string
    team_a: string
    team_b: string
  }>
}

export interface IAdminBatchResultItem {
  gameId: string
  status: 'ok' | 'erro'
  message: string
}

export interface IAdminBatchResponse {
  sucesso: number
  erros: number
  detalhes: IAdminBatchResultItem[]
}
