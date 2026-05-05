import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createUser } from './api'
import type { IUser } from './type'

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
