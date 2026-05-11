import { createFileRoute } from '@tanstack/react-router'
import { useGetUserId } from '@/services/users/query'

export const Route = createFileRoute('/(private)/participantes/$userId/')({
  component: UserIdPage,
  head: () => ({
    meta: [
      {
        title: 'Participante | Palpitei',
      },
    ],
  }),
})

function UserIdPage() {
  const { userId } = Route.useParams()

  const user = useGetUserId(userId)
  if (!user.data) return <div>Carregando...</div>

  return <div>Hello {user.data.name}!</div>
}
