import { api } from '@/lib/api'
import type {
  IAdminBatchResponse,
  IAdminDashboard,
  IAdminMessageResponse,
  IApurarCampeaoResponse,
  IAtualizarParticipantesLotePayload,
  IAtualizarParticipantesPayload,
  ICorrigirResultadoPayload,
  ILoteResultadosPayload,
  IPopularBaseResponse,
  IRecalcularPontuacaoResponse,
  IResultadoPayload,
} from './type'

const adminHeaders = {
  requiresAdminAuth: true,
}

export async function getAdminDashboard() {
  const res = await api.get<IAdminDashboard>('/admin/dashboard', {
    headers: adminHeaders,
  })

  return res.data
}

export async function corrigirResultado(
  gameId: string,
  payload: ICorrigirResultadoPayload
) {
  const res = await api.put<IAdminMessageResponse>(
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
  const res = await api.put<IAdminMessageResponse>(
    `/admin/jogos/${gameId}/participantes`,
    payload,
    { headers: adminHeaders }
  )

  return res.data
}

export async function atualizarParticipantesLote(
  payload: IAtualizarParticipantesLotePayload
) {
  const res = await api.put<IAdminBatchResponse>(
    '/admin/jogos/participantes/lote',
    payload,
    { headers: adminHeaders }
  )

  return res.data
}

export async function recalcularPontuacao() {
  const res = await api.post<IRecalcularPontuacaoResponse>(
    '/admin/recalcular',
    undefined,
    { headers: adminHeaders }
  )

  return res.data
}

export async function apurarCampeao(teamId: string) {
  const res = await api.post<IApurarCampeaoResponse>(
    '/admin/campeao',
    { teamId },
    { headers: adminHeaders }
  )

  return res.data
}

export async function inserirResultadosLote(payload: ILoteResultadosPayload) {
  const res = await api.post<IAdminBatchResponse>(
    '/admin/resultados/lote',
    payload,
    { headers: adminHeaders }
  )

  return res.data
}

export async function inserirResultado(payload: IResultadoPayload) {
  const res = await api.post<IAdminMessageResponse>(
    '/admin/resultado',
    payload,
    { headers: adminHeaders }
  )

  return res.data
}

export async function popularBaseLocal() {
  const res = await api.post<IPopularBaseResponse>(
    '/admin/popular-base',
    undefined,
    { headers: adminHeaders }
  )

  return res.data
}
