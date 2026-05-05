import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { IUser } from './type'

type CreateUserInput = { name: string }

export function useCreateLogin() {
  const queryClient = useQueryClient()

  return useMutation<IUser, Error, CreateUserInput>({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export async function createUser(data: CreateUserInput) {
  try {
    const res = await api.post<IUser>('/users', data)
    return res.data
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}
