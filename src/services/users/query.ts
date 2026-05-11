import { useQuery } from '@tanstack/react-query'
import { listUserId, listUsers } from './api'
import type { IUser } from './type'

export function useListUsers() {
  return useQuery<IUser[], Error>({
    queryKey: ['users'],
    queryFn: listUsers,
  })
}

export function useGetUserId(userId: string) {
  return useQuery<IUser, Error>({
    queryKey: ['users', userId],
    queryFn: () => listUserId(userId),
  })
}
