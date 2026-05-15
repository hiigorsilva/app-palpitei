import { createFileRoute } from '@tanstack/react-router'
import { TitleContainer } from '@/components/title-container'
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
  if (!user.data) return <div>Carregando Usuário...</div>

  return (
    <section className="flex flex-col gap-6">
      <TitleContainer>{user.data.name}</TitleContainer>
    </section>
  )
}
