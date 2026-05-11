import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { IUser } from '../users/type'
import { createUser } from './api'

export type CreateUserInput = { name: string }

export function useCreateLogin() {
  const queryClient = useQueryClient()

  return useMutation<IUser, Error, CreateUserInput>({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
