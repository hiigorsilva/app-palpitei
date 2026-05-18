import { createFileRoute } from '@tanstack/react-router'
import { TrophyIcon } from 'lucide-react'
import { NextGames } from '@/components/next-games'
import { RankingTable } from '@/components/ranking-table'
import { TitleContainer } from '@/components/title-container'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Users } from '@/components/users'
import { getStorageAuth } from '@/helpers/auth'
import { useListDailyGames, useNextGames } from '@/services/games/query'
import { useRanking } from '@/services/ranking/query'
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
  const ranking = useRanking()

  if (!nextGames.data) return <div>Carregando Próximos Jogos...</div>
  if (!users.data) return <div>Carregando Usuários...</div>
  if (!games.data) return <div>Carregando Jogos Diários...</div>
  if (!ranking.data) return <div>Carregando Ranking...</div>

  return (
    <section className="min-w-0 w-full flex flex-col gap-6">
      <TitleContainer>
        <Button
          className={'bg-muted cursor-auto hover:bg-muted'}
          size={'icon'}
          type="button"
        >
          <TrophyIcon />
        </Button>
        Dashboard do Bolão Copa do Mundo 2026
      </TitleContainer>

      <Card className="bg-transparent p-3">
        <NextGames nextGames={nextGames.data} />
      </Card>

      <div className="grid grid-cols-2 gap-6">
        <RankingTable variant="full" data={ranking.data} />
        <DailyMatchesSummary matches={nextGames.data} />
        <Users users={users.data} />
      </div>
    </section>
  )
}
