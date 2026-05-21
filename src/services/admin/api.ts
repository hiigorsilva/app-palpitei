import { api } from '@/lib/api'
import type {
  IAdminCampeaoResponse,
  IAdminCorrigirResultadoResponse,
  IAdminDashboardResponse,
  IAdminParticipantesLoteResponse,
  IAdminParticipantesResponse,
  IAdminPopularBaseResponse,
  IAdminRecalcularResponse,
  IAdminResultadoResponse,
  IAdminResultadosLoteResponse,
  IAtualizarParticipantesLotePayload,
  IAtualizarParticipantesPayload,
  ICorrigirResultadoPayload,
  ILoteResultadosPayload,
  IResultadoPayload,
} from './type'

const adminHeaders = {
  requiresAdminAuth: true,
}

export async function getAdminDashboard() {
  const res = await api.get<IAdminDashboardResponse>('/admin/dashboard', {
    headers: adminHeaders,
  })

  return res.data
}

export async function corrigirResultado(
  gameId: string,
  payload: ICorrigirResultadoPayload
) {
  const res = await api.put<IAdminCorrigirResultadoResponse>(
    `/admin/resultado/${gameId}`,
    payload,
    { headers: adminHeaders }
  )

  return res.data
}

export async function atualizarParticipantesJogo(
  gameId: string,
  payload: IAtualizarParticipantesPayload
) {
  const res = await api.put<IAdminParticipantesResponse>(
    `/admin/jogos/${gameId}/participantes`,
    payload,
    { headers: adminHeaders }
  )

  return res.data
}

export async function atualizarParticipantesLote(
  payload: IAtualizarParticipantesLotePayload
) {
  const res = await api.put<IAdminParticipantesLoteResponse>(
    '/admin/jogos/participantes/lote',
    payload,
    { headers: adminHeaders }
  )

  return res.data
}

export async function recalcularPontuacao() {
  const res = await api.post<IAdminRecalcularResponse>(
    '/admin/recalcular',
    undefined,
    { headers: adminHeaders }
  )

  return res.data
}

export async function apurarCampeao(teamId: string) {
  const res = await api.post<IAdminCampeaoResponse>(
    '/admin/campeao',
    { teamId },
    { headers: adminHeaders }
  )

  return res.data
}

export async function inserirResultadosLote(payload: ILoteResultadosPayload) {
  const res = await api.post<IAdminResultadosLoteResponse>(
    '/admin/resultados/lote',
    payload,
    { headers: adminHeaders }
  )

  return res.data
}

export async function inserirResultado(payload: IResultadoPayload) {
  const res = await api.post<IAdminResultadoResponse>(
    '/admin/resultado',
    payload,
    { headers: adminHeaders }
  )

  return res.data
}

export async function popularBaseLocal() {
  const res = await api.post<IAdminPopularBaseResponse>(
    '/admin/popular-base',
    undefined,
    { headers: adminHeaders }
  )

  return res.data
}
