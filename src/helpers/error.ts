import { isAxiosError } from 'axios'
import { toast } from 'sonner'

export function ErrorResponseApi(error: unknown) {
  if (isAxiosError<{ message?: string }>(error)) {
    toast.error(error.response?.data?.message ?? error.message)
    return
  }

  if (error instanceof Error) {
    toast.error(error.message)
    return
  }
  toast.error('Ocorreu um erro inesperado. Tente novamente.')
}
