import { createFileRoute } from '@tanstack/react-router'
import { RankingTable } from '@/components/ranking-table'
import { Users } from '@/components/users'
import { useListDailyGames } from '@/services/games/query'
import { useListUsers } from '@/services/users/query'
import { DailyMatchesSummary } from './-components/daily-games'

export const Route = createFileRoute('/(private)/')({
  component: HomePage,
  head: () => ({
    meta: [
      {
        title: 'Palpitei | Bolão Copa do Mundo 2026',
      },
    ],
  }),
})

function HomePage() {
  const games = useListDailyGames()
  const users = useListUsers()

  if (!users.data) return <div>Carregando...</div>
  if (!games.data) return <div>Carregando...</div>

  return (
    <div className="flex flex-col">
      <h1>Bem-vindo ao Palpitei - Bolão Copa do Mundo 2026!</h1>
      <RankingTable
        variant="summary"
        data={[
          {
            position: 1,
            userId: 'user-001',
            name: 'Higor Silva',
            pontos_total: 2450,
            pontos_apostas: 2100,
            pontos_bonus: 350,
            acertos: 42,
            total_apostas: 50,
            taxa_acerto: 84,
          },
          {
            position: 2,
            userId: 'user-002',
            name: 'Ana Beatriz',
            pontos_total: 2310,
            pontos_apostas: 2150,
            pontos_bonus: 160,
            acertos: 38,
            total_apostas: 45,
            taxa_acerto: 84,
          },
          {
            position: 3,
            userId: 'user-003',
            name: 'Lucas Oliveira',
            pontos_total: 2100,
            pontos_apostas: 1900,
            pontos_bonus: 200,
            acertos: 35,
            total_apostas: 50,
            taxa_acerto: 70,
          },
          {
            position: 4,
            userId: 'user-004',
            name: 'Mariana Costa',
            pontos_total: 1950,
            pontos_apostas: 1850,
            pontos_bonus: 100,
            acertos: 30,
            total_apostas: 42,
            taxa_acerto: 71,
          },
          {
            position: 5,
            userId: 'user-005',
            name: 'Rafael Santos',
            pontos_total: 1800,
            pontos_apostas: 1750,
            pontos_bonus: 50,
            acertos: 28,
            total_apostas: 48,
            taxa_acerto: 58,
          },
          {
            position: 6,
            userId: 'user-006',
            name: 'Juliana Ferreira',
            pontos_total: 1650,
            pontos_apostas: 1600,
            pontos_bonus: 50,
            acertos: 25,
            total_apostas: 40,
            taxa_acerto: 62,
          },
          {
            position: 7,
            userId: 'user-007',
            name: 'Thiago Souza',
            pontos_total: 1400,
            pontos_apostas: 1400,
            pontos_bonus: 0,
            acertos: 20,
            total_apostas: 45,
            taxa_acerto: 44,
          },
        ]}
      />
      <DailyMatchesSummary matches={games.data} />
      <Users users={users.data} />
    </div>
  )
}
