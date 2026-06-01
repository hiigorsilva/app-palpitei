import axios, { type AxiosError } from 'axios'
import { getStorageAdminAuth } from '@/helpers/auth'
import { env } from '@/services/env'

export const api = axios.create({
  baseURL: env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  config => {
    const isPublicRoute = config.headers?.isPublic
    const requiresAdminAuth = config.headers?.requiresAdminAuth

    if (!isPublicRoute && requiresAdminAuth) {
      const adminAuth = getStorageAdminAuth()

      if (!adminAuth) {
        return Promise.reject(new Error('Credenciais de admin não informadas.'))
      }

      const { username, password } = adminAuth
      config.headers.Authorization = `Basic ${btoa(`${username}:${password}`)}`
    }

    if (config.headers?.isPublic) {
      delete config.headers.isPublic
    }

    if (config.headers?.requiresAdminAuth) {
      delete config.headers.requiresAdminAuth
    }

    return config
  },
  error => {
    const message = error.response?.data?.message || 'Erro na requisição'
    return Promise.reject(new Error(message))
  }
)

type ApiErrorResponse = {
  message?: string
}

api.interceptors.response.use(
  response => response,
  (error: AxiosError<ApiErrorResponse>) => {
    // Tenta pegar mensagem da API
    const message =
      error.response?.data?.message || error.message || 'Erro inesperado'

    // Opcional: você pode logar aqui
    console.error('[API ERROR]:', message)

    // Retorna erro tratado
    return Promise.reject(new Error(message))
  }
)
