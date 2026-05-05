import { toast } from 'sonner'

export function ErrorResponseApi(error: unknown) {
  if (error instanceof Error) {
    toast.error(error.message)
    return
  }
  toast.error('Ocorreu um erro inesperado. Tente novamente.')
}
