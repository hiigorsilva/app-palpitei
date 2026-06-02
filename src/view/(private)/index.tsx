import { createFileRoute } from '@tanstack/react-router'
import {
  CalendarDaysIcon,
  MedalIcon,
  TrophyIcon,
  UsersRoundIcon,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { Loading } from '@/components/loading'
import { NextGames } from '@/components/next-games'
import { RankingTable } from '@/components/ranking-table'
import { TitleContainer } from '@/components/title-container'
import { Badge } from '@/components/ui/badge'
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
        title: 'Início | Palpitei',
      },
    ],
  }),
})

type MetricCardProps = {
  icon: ReactNode
  label: string
  value: ReactNode
  helper: string
}

function MetricCard({ icon, label, value, helper }: MetricCardProps) {
  return (
    <Card className="gap-3 rounded-lg p-4">
      <div className="flex items-center justify-start gap-3">
        <span className="flex size-9 items-center justify-center rounded-md bg-primary/15 text-primary">
          {icon}
        </span>
        <span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="space-y-1">
        <strong className="block truncate text-2xl text-center font-semibold leading-none text-foreground">
          {value}
        </strong>
        <span className="block truncate text-xs text-center text-muted-foreground">
          {helper}
        </span>
      </div>
    </Card>
  )
}

function HomePage() {
  const userId = getStorageAuth()?.id
  const games = useListDailyGames(userId)
  const users = useListUsers()
  const nextGames = useNextGames(userId)
  const ranking = useRanking()

  if (!nextGames.data) return <Loading />
  if (!users.data) return <Loading />
  if (!games.data) return <Loading />
  if (!ranking.data) return <Loading />

  const leader = ranking.data[0]
  const positionsByUserId = new Map(
    ranking.data.map(item => [item.userId, item.position] as const)
  )

  return (
    <section className="flex min-w-0 w-full flex-col gap-6">
      <div className="rounded-xl border bg-card p-5 shadow-xs sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 space-y-3">
            <Badge
              variant="secondary"
              className="h-7 gap-1.5 rounded-md px-2.5 text-xs"
            >
              <TrophyIcon className="size-3.5" />
              Copa do Mundo FIFA 2026
            </Badge>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-normal text-foreground sm:text-3xl">
                Dashboard do Bolão
              </h1>
              <p className="max-w-2xl text-sm text-pretty leading-6 text-muted-foreground">
                Acompanhe os próximos jogos, veja os palpites ativos e siga a
                disputa entre os participantes em um só lugar.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-130">
            <MetricCard
              icon={<CalendarDaysIcon className="size-4" />}
              label="Hoje"
              value={games.data.length}
              helper="jogos programados"
            />
            <MetricCard
              icon={<UsersRoundIcon className="size-4" />}
              label="Participantes"
              value={users.data.length}
              helper="no bolão"
            />
            <MetricCard
              icon={<MedalIcon className="size-4" />}
              label="Líder"
              value={leader?.name ?? 'Sem ranking'}
              helper={
                leader ? `${leader.pontos_total} pontos` : 'aguardando dados'
              }
            />
          </div>
        </div>
      </div>

      <section className="flex min-w-0 flex-col gap-2">
        <TitleContainer>Próximos Jogos</TitleContainer>
        <div className="min-w-0 overflow-hidden rounded-lg border bg-card p-2 shadow-xs">
          <NextGames nextGames={nextGames.data} />
        </div>
      </section>

      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
        <div className="flex min-w-0 flex-col gap-6">
          <section className="flex min-w-0 flex-col gap-2">
            <TitleContainer>Ranking do Bolão</TitleContainer>
            <RankingTable variant="full" data={ranking.data} />
          </section>

          <section className="flex min-w-0 flex-col gap-2">
            <TitleContainer>Participantes</TitleContainer>
            <Users users={users.data} positionsByUserId={positionsByUserId} />
          </section>
        </div>

        <aside className="flex min-w-0 flex-col gap-2">
          <TitleContainer>Jogos do Dia</TitleContainer>
          <DailyMatchesSummary matches={games.data} />
        </aside>
      </div>
    </section>
  )
}
