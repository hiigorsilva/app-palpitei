import { createFileRoute } from '@tanstack/react-router'
import { NextGames } from '@/components/next-games'
import { RankingTable } from '@/components/ranking-table'
import { TitleContainer } from '@/components/title-container'
import { Users } from '@/components/users'
import { getStorageAuth } from '@/helpers/auth'
import { useListDailyGames, useNextGames } from '@/services/games/query'
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
  const userId = getStorageAuth()?.id
  const games = useListDailyGames(userId)
  const users = useListUsers()
  const nextGames = useNextGames(userId)

  if (!nextGames.data) return <div>Carregando Próximos Jogos...</div>
  if (!users.data) return <div>Carregando Usuários...</div>
  if (!games.data) return <div>Carregando Jogos Diários...</div>

  return (
    <section className="min-w-0 w-full flex flex-col gap-6">
      <TitleContainer>
        Bem-vindo ao Palpitei - Bolão Copa do Mundo 2026!
      </TitleContainer>

      <div className="min-w-0 w-full">
        <NextGames nextGames={nextGames.data} />
      </div>

      <div className="grid grid-cols-2 gap-6">
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
              pontos_campeao: 0,
            },
          ]}
        />
        <DailyMatchesSummary matches={games.data} />
        <Users users={users.data} />
      </div>
    </section>
  )
}
