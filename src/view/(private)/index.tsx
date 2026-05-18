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

      <p className="text-muted-foreground">
        Acompanhe os próximos jogos, confira o ranking dos participantes e veja
        um resumo dos jogos do dia.
      </p>

      <div className="grid grid-cols-5 gap-6">
        {/* LEFTSIDE */}
        <div className="col-span-3 w-full flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <TitleContainer>Ranking do Bolão</TitleContainer>
            <RankingTable variant="full" data={ranking.data} />
          </div>

          <div className="flex flex-col gap-2">
            <TitleContainer>Participantes</TitleContainer>
            <Users users={users.data} />
          </div>

          <div className="w-full flex flex-col gap-2">
            <TitleContainer>Próximos Jogos</TitleContainer>
            <Card className="bg-transparent p-2 overflow-hidden">
              <NextGames nextGames={nextGames.data} />
            </Card>
          </div>
        </div>

        {/* RIGHTSIDE */}
        <div className="col-span-2 w-full flex flex-col gap-2">
          <TitleContainer>Jogos do Dia</TitleContainer>
          <DailyMatchesSummary matches={nextGames.data} />
        </div>
      </div>
    </section>
  )
}
