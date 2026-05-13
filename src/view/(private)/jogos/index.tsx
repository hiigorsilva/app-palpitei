import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeftIcon } from 'lucide-react'
import { useMemo } from 'react'
import { TitleContainer } from '@/components/title-container'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getStorageAuth } from '@/helpers/auth'
import { formatDate } from '@/helpers/date'
import { useListGames } from '@/services/games/query'
import type { IGame } from '@/services/games/type'
import { GameItemCard } from './-components/game-item-card'
import { GameItemCardGrid } from './-components/game-item-card-grid'
import { GameItemCardTitle } from './-components/game-item-card-title'
import { GameItemGridGroupDate } from './-components/game-item-grid-group-date'
import { GameItemGridGroupDateItem } from './-components/game-item-grid-group-date-item'

const DEFAULT_TAB = 'group'
const GAMES_TABS = [
  DEFAULT_TAB,
  '16_avos',
  'oitavas',
  'quartas',
  'semifinais',
  'terceiro_lugar',
  'final',
] as const

type GamesTab = (typeof GAMES_TABS)[number]
type GamesSearch = {
  tab?: GamesTab
}

function isGamesTab(tab: unknown): tab is GamesTab {
  return typeof tab === 'string' && GAMES_TABS.includes(tab as GamesTab)
}

export const Route = createFileRoute('/(private)/jogos/')({
  validateSearch: (search: Record<string, unknown>): GamesSearch => ({
    tab: isGamesTab(search.tab) ? search.tab : undefined,
  }),
  component: GamesPage,
  head: () => ({
    meta: [
      {
        title: 'Jogos | Palpitei',
      },
    ],
  }),
})

function GamesPage() {
  const navigate = Route.useNavigate()
  const { tab } = Route.useSearch()
  const activeTab = tab ?? DEFAULT_TAB
  const userId = getStorageAuth()?.id

  const handleTabChange = (value: string | number) => {
    if (!isGamesTab(value)) return

    navigate({
      replace: true,
      to: '.',
      search: value === DEFAULT_TAB ? {} : { tab: value },
    })
  }

  function handleBackNavigate() {
    navigate({ to: '..' })
  }

  return (
    <section className="flex flex-col gap-6">
      <TitleContainer>
        <Button
          size={'icon'}
          variant={'ghost'}
          className={'cursor-pointer'}
          onClick={handleBackNavigate}
        >
          <ArrowLeftIcon />
        </Button>
        Calendário de Jogos
      </TitleContainer>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className={'p-0'} variant="line">
          <TabsTrigger className={'leading-none'} value="group">
            Fase de Grupos
          </TabsTrigger>
          <TabsTrigger className={'leading-none'} value="16_avos">
            Fase 16 Avos
          </TabsTrigger>
          <TabsTrigger className={'leading-none'} value="oitavas">
            Oitavas de Final
          </TabsTrigger>
          <TabsTrigger className={'leading-none'} value="quartas">
            Quartas de Final
          </TabsTrigger>
          <TabsTrigger className={'leading-none'} value="semifinais">
            Semifinais
          </TabsTrigger>
          <TabsTrigger className={'leading-none'} value="terceiro_lugar">
            Terceiro Lugar
          </TabsTrigger>
          <TabsTrigger className={'leading-none'} value="final">
            Final
          </TabsTrigger>
        </TabsList>
        <TabsContent value="group">
          <GroupGamesTab userId={userId} />
        </TabsContent>
        <TabsContent value="16_avos">
          <SixteenAvosGamesTab userId={userId} />
        </TabsContent>
        <TabsContent value="oitavas">
          <OitavasGamesTab userId={userId} />
        </TabsContent>
        <TabsContent value="quartas">
          <QuartasGamesTab userId={userId} />
        </TabsContent>
        <TabsContent value="semifinais">
          <SemiGamesTab userId={userId} />
        </TabsContent>
        <TabsContent value="terceiro_lugar">
          <TerceiroGamesTab userId={userId} />
        </TabsContent>
        <TabsContent value="final">
          <FinalsGamesTab userId={userId} />
        </TabsContent>
      </Tabs>
    </section>
  )
}

export type GamesByDate = {
  date: string
  games: IGame[]
}

type GamesTabProps = {
  userId?: string
}

export function GroupGamesTab({ userId }: GamesTabProps) {
  const games = useListGames(userId, { fase: 'GRUPOS', status: 'FUTURO' })

  const gamesByDate = useMemo<GamesByDate[]>(() => {
    if (!games.data) return []
    const groupedGames = games.data.reduce<Record<string, GamesByDate>>(
      (groups, game) => {
        const date = formatDate(game.data_hora) ?? 'Data não informada'
        if (!groups[date]) {
          groups[date] = {
            date,
            games: [],
          }
        }
        groups[date].games.push(game)
        return groups
      },
      {}
    )
    return Object.values(groupedGames)
  }, [games.data])
  return (
    <>
      {gamesByDate.length > 0 && (
        <GameItemGridGroupDate>
          {gamesByDate.map(group => (
            <GameItemGridGroupDateItem key={group.date} group={group}>
              <GameItemCardTitle group={group} />
              <GameItemCardGrid>
                {group.games.map(game => (
                  <Link
                    key={game.id}
                    to={'/jogos/$gameId'}
                    params={{ gameId: game.id }}
                  >
                    <GameItemCard className="w-2xs" key={game.id} game={game} />
                  </Link>
                ))}
              </GameItemCardGrid>
            </GameItemGridGroupDateItem>
          ))}
        </GameItemGridGroupDate>
      )}
    </>
  )
}

export function SixteenAvosGamesTab({ userId }: GamesTabProps) {
  const games = useListGames(userId, { fase: '16_AVOS', status: 'FUTURO' })

  const gamesByDate = useMemo<GamesByDate[]>(() => {
    if (!games.data) return []
    const groupedGames = games.data.reduce<Record<string, GamesByDate>>(
      (groups, game) => {
        const date = formatDate(game.data_hora) ?? 'Data não informada'
        if (!groups[date]) {
          groups[date] = {
            date,
            games: [],
          }
        }
        groups[date].games.push(game)
        return groups
      },
      {}
    )
    return Object.values(groupedGames)
  }, [games.data])
  return (
    <>
      {gamesByDate.length > 0 && (
        <GameItemGridGroupDate>
          {gamesByDate.map(group => (
            <GameItemGridGroupDateItem key={group.date} group={group}>
              <GameItemCardTitle group={group} />
              <GameItemCardGrid>
                {group.games.map(game => (
                  <Link
                    key={game.id}
                    to={'/jogos/$gameId'}
                    params={{ gameId: game.id }}
                  >
                    <GameItemCard className="w-2xs" key={game.id} game={game} />
                  </Link>
                ))}
              </GameItemCardGrid>
            </GameItemGridGroupDateItem>
          ))}
        </GameItemGridGroupDate>
      )}
    </>
  )
}

export function OitavasGamesTab({ userId }: GamesTabProps) {
  const games = useListGames(userId, { fase: 'OITAVAS', status: 'FUTURO' })

  const gamesByDate = useMemo<GamesByDate[]>(() => {
    if (!games.data) return []
    const groupedGames = games.data.reduce<Record<string, GamesByDate>>(
      (groups, game) => {
        const date = formatDate(game.data_hora) ?? 'Data não informada'
        if (!groups[date]) {
          groups[date] = {
            date,
            games: [],
          }
        }
        groups[date].games.push(game)
        return groups
      },
      {}
    )
    return Object.values(groupedGames)
  }, [games.data])
  return (
    <>
      {gamesByDate.length > 0 && (
        <GameItemGridGroupDate>
          {gamesByDate.map(group => (
            <GameItemGridGroupDateItem key={group.date} group={group}>
              <GameItemCardTitle group={group} />
              <GameItemCardGrid>
                {group.games.map(game => (
                  <Link
                    key={game.id}
                    to={'/jogos/$gameId'}
                    params={{ gameId: game.id }}
                  >
                    <GameItemCard className="w-2xs" key={game.id} game={game} />
                  </Link>
                ))}
              </GameItemCardGrid>
            </GameItemGridGroupDateItem>
          ))}
        </GameItemGridGroupDate>
      )}
    </>
  )
}

export function QuartasGamesTab({ userId }: GamesTabProps) {
  const games = useListGames(userId, { fase: 'QUARTAS', status: 'FUTURO' })

  const gamesByDate = useMemo<GamesByDate[]>(() => {
    if (!games.data) return []
    const groupedGames = games.data.reduce<Record<string, GamesByDate>>(
      (groups, game) => {
        const date = formatDate(game.data_hora) ?? 'Data não informada'
        if (!groups[date]) {
          groups[date] = {
            date,
            games: [],
          }
        }
        groups[date].games.push(game)
        return groups
      },
      {}
    )
    return Object.values(groupedGames)
  }, [games.data])
  return (
    <>
      {gamesByDate.length > 0 && (
        <GameItemGridGroupDate>
          {gamesByDate.map(group => (
            <GameItemGridGroupDateItem key={group.date} group={group}>
              <GameItemCardTitle group={group} />
              <GameItemCardGrid>
                {group.games.map(game => (
                  <Link
                    key={game.id}
                    to={'/jogos/$gameId'}
                    params={{ gameId: game.id }}
                  >
                    <GameItemCard className="w-2xs" key={game.id} game={game} />
                  </Link>
                ))}
              </GameItemCardGrid>
            </GameItemGridGroupDateItem>
          ))}
        </GameItemGridGroupDate>
      )}
    </>
  )
}

export function SemiGamesTab({ userId }: GamesTabProps) {
  const games = useListGames(userId, { fase: 'SEMI', status: 'FUTURO' })

  const gamesByDate = useMemo<GamesByDate[]>(() => {
    if (!games.data) return []
    const groupedGames = games.data.reduce<Record<string, GamesByDate>>(
      (groups, game) => {
        const date = formatDate(game.data_hora) ?? 'Data não informada'
        if (!groups[date]) {
          groups[date] = {
            date,
            games: [],
          }
        }
        groups[date].games.push(game)
        return groups
      },
      {}
    )
    return Object.values(groupedGames)
  }, [games.data])
  return (
    <>
      {gamesByDate.length > 0 && (
        <GameItemGridGroupDate>
          {gamesByDate.map(group => (
            <GameItemGridGroupDateItem key={group.date} group={group}>
              <GameItemCardTitle group={group} />
              <GameItemCardGrid>
                {group.games.map(game => (
                  <Link
                    key={game.id}
                    to={'/jogos/$gameId'}
                    params={{ gameId: game.id }}
                  >
                    <GameItemCard className="w-2xs" key={game.id} game={game} />
                  </Link>
                ))}
              </GameItemCardGrid>
            </GameItemGridGroupDateItem>
          ))}
        </GameItemGridGroupDate>
      )}
    </>
  )
}

export function TerceiroGamesTab({ userId }: GamesTabProps) {
  const games = useListGames(userId, { fase: 'TERCEIRO', status: 'FUTURO' })

  const gamesByDate = useMemo<GamesByDate[]>(() => {
    if (!games.data) return []
    const groupedGames = games.data.reduce<Record<string, GamesByDate>>(
      (groups, game) => {
        const date = formatDate(game.data_hora) ?? 'Data não informada'
        if (!groups[date]) {
          groups[date] = {
            date,
            games: [],
          }
        }
        groups[date].games.push(game)
        return groups
      },
      {}
    )
    return Object.values(groupedGames)
  }, [games.data])
  return (
    <>
      {gamesByDate.length > 0 && (
        <GameItemGridGroupDate>
          {gamesByDate.map(group => (
            <GameItemGridGroupDateItem key={group.date} group={group}>
              <GameItemCardTitle group={group} />
              <GameItemCardGrid>
                {group.games.map(game => (
                  <Link
                    key={game.id}
                    to={'/jogos/$gameId'}
                    params={{ gameId: game.id }}
                  >
                    <GameItemCard className="w-2xs" key={game.id} game={game} />
                  </Link>
                ))}
              </GameItemCardGrid>
            </GameItemGridGroupDateItem>
          ))}
        </GameItemGridGroupDate>
      )}
    </>
  )
}

export function FinalsGamesTab({ userId }: GamesTabProps) {
  const games = useListGames(userId, { fase: 'FINAL', status: 'FUTURO' })

  const gamesByDate = useMemo<GamesByDate[]>(() => {
    if (!games.data) return []
    const groupedGames = games.data.reduce<Record<string, GamesByDate>>(
      (groups, game) => {
        const date = formatDate(game.data_hora) ?? 'Data não informada'
        if (!groups[date]) {
          groups[date] = {
            date,
            games: [],
          }
        }
        groups[date].games.push(game)
        return groups
      },
      {}
    )
    return Object.values(groupedGames)
  }, [games.data])
  return (
    <>
      {gamesByDate.length > 0 && (
        <GameItemGridGroupDate>
          {gamesByDate.map(group => (
            <GameItemGridGroupDateItem key={group.date} group={group}>
              <GameItemCardTitle group={group} />
              <GameItemCardGrid>
                {group.games.map(game => (
                  <Link
                    key={game.id}
                    to={'/jogos/$gameId'}
                    params={{ gameId: game.id }}
                  >
                    <GameItemCard className="w-2xs" key={game.id} game={game} />
                  </Link>
                ))}
              </GameItemCardGrid>
            </GameItemGridGroupDateItem>
          ))}
        </GameItemGridGroupDate>
      )}
    </>
  )
}
