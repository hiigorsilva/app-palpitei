import { createFileRoute } from '@tanstack/react-router'
import { CardProfile } from '@/components/card-profile'
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
  if (!user.data) return <div>Carregando...</div>

  return (
    <section className="flex flex-col gap-6">
      <TitleContainer>{user.data.name}</TitleContainer>
      <CardProfile
        user={{
          userId: 'user-id',
          name: 'Higor',
          bonus_concedido: 100,
          jogos_apostados: 10,
          nivel_atual: 'Bronze',
          percentual: 50,
          proximo_nivel: {
            nivel: 'Platina',
            bonusPontos: 200,
            minimoPercentual: 70,
          },
          total_jogos: 20,
        }}
      />
    </section>
  )
}
