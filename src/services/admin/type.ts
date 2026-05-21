import type { IMessageResponse, TLoteStatus } from '../type.utils'

export type IAdminResultadoResponse = IMessageResponse

export type IAdminCorrigirResultadoResponse = IMessageResponse

export interface IResultadoPayload {
  gameId: string
  gols_a: number
  gols_b: number
}

export type ICorrigirResultadoPayload = Omit<IResultadoPayload, 'gameId'>

export interface ILoteDetalheItem {
  gameId: string
  status: TLoteStatus
  message: string
}

export interface ILoteResponse {
  sucesso: number
  erros: number
  detalhes: ILoteDetalheItem[]
}

export type IAdminResultadosLoteResponse = ILoteResponse

export type IAdminParticipantesLoteResponse = ILoteResponse

export type IAdminParticipantesResponse = IMessageResponse

export interface ILoteResultadosPayload {
  resultados: IResultadoPayload[]
}

export interface IAtualizarParticipantesPayload {
  team_a: string
  team_b: string
}

export interface IAtualizarParticipantesLotePayload {
  jogos: Array<IAtualizarParticipantesPayload & { gameId: string }>
}

export interface IAdminCampeaoResponse {
  message: string
  campeao: string
  pontos: number
  palpites_corretos: number
}

export interface IAdminRecalcularResponse {
  message: string
  usuarios_atualizados: number
  apostas_processadas: number
}

export interface IAdminDashboardResponse {
  total_usuarios: number
  total_apostas: number
  total_jogos: number
  jogos_encerrados: number
  jogos_pendentes: number
  usuarios_com_apostas: number
  media_apostas_por_usuario: number
}

export interface IAdminPopularBaseResponse {
  teams_inseridos: number
  teams_ignorados: number
  jogos_inseridos: number
  jogos_atualizados: number
  jogos_ignorados: number
}
