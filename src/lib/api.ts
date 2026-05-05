import axios, { type AxiosError } from 'axios'
import { getStorageAuth } from '@/helpers/auth'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  config => {
    const basicAuth = getStorageAuth()
    const isPublicRoute = config.headers?.isPublic

    // Só injeta auth se NÃO for rota pública
    if (!isPublicRoute && basicAuth) {
      const { username, password } = basicAuth
      config.headers.Authorization = `Basic ${btoa(`${username}:${password}`)}`
    }

    // Limpa flag custom
    if (config.headers?.isPublic) {
      delete config.headers.isPublic
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
