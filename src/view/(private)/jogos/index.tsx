import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'
import { Container } from '@/components/container'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatDate } from '@/helpers/date'
import { useListGames } from '@/services/games/query'
import type { IGame } from '@/services/games/type'
import { GameItemCard } from './-components/game-item-card'
import { GameItemCardGrid } from './-components/game-item-card-grid'
import { GameItemCardTitle } from './-components/game-item-card-title'
import { GameItemGridGroupDate } from './-components/game-item-grid-group-date'
import { GameItemGridGroupDateItem } from './-components/game-item-grid-group-date-item'
export const Route = createFileRoute('/(private)/jogos/')({
  component: GamesPage,
})

function GamesPage() {
  return (
    <Container>
      <Tabs defaultValue="all-games">
        <TabsList variant="line">
          <TabsTrigger value="all-games">Todos os Jogos</TabsTrigger>
          <TabsTrigger value="group">Fase de Grupos</TabsTrigger>
          <TabsTrigger value="16_avos">16 Avos</TabsTrigger>
          <TabsTrigger value="oitavas">Oitavas de Final</TabsTrigger>
          <TabsTrigger value="quartas">Quartas de Final</TabsTrigger>
          <TabsTrigger value="semifinais">Semifinais</TabsTrigger>
          <TabsTrigger value="terceiro_lugar">Terceiro Lugar</TabsTrigger>
          <TabsTrigger value="final">Final</TabsTrigger>
        </TabsList>
        <TabsContent value="all-games">
          <AllGamesTab />
        </TabsContent>
        <TabsContent value="group">
          <GroupGamesTab />
        </TabsContent>
        <TabsContent value="16_avos">
          <ThirtyTwoAvosGamesTab />
        </TabsContent>
        <TabsContent value="oitavas">
          <OitavasGamesTab />
        </TabsContent>
        <TabsContent value="quartas">
          <QuartasGamesTab />
        </TabsContent>
        <TabsContent value="semifinais">
          <SemiGamesTab />
        </TabsContent>
        <TabsContent value="terceiro_lugar">
          <TerceiroGamesTab />
        </TabsContent>
        <TabsContent value="final">
          <FinalsGamesTab />
        </TabsContent>
      </Tabs>
    </Container>
  )
}

export type GamesByDate = {
  date: string
  games: IGame[]
}

export function AllGamesTab() {
  const games = useListGames()

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
                  <li key={game.id}>
                    <GameItemCard className="w-2xs" key={game.id} game={game} />
                  </li>
                ))}
              </GameItemCardGrid>
            </GameItemGridGroupDateItem>
          ))}
        </GameItemGridGroupDate>
      )}
    </>
  )
}

export function GroupGamesTab() {
  const games = useListGames({ fase: 'GRUPOS', status: 'FUTURO' })

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
                  <li key={game.id}>
                    <GameItemCard className="w-2xs" key={game.id} game={game} />
                  </li>
                ))}
              </GameItemCardGrid>
            </GameItemGridGroupDateItem>
          ))}
        </GameItemGridGroupDate>
      )}
    </>
  )
}

export function ThirtyTwoAvosGamesTab() {
  const games = useListGames({ fase: '32_AVOS', status: 'FUTURO' })

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
                  <li key={game.id}>
                    <GameItemCard className="w-2xs" key={game.id} game={game} />
                  </li>
                ))}
              </GameItemCardGrid>
            </GameItemGridGroupDateItem>
          ))}
        </GameItemGridGroupDate>
      )}
    </>
  )
}

export function OitavasGamesTab() {
  const games = useListGames({ fase: 'OITAVAS', status: 'FUTURO' })

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
                  <li key={game.id}>
                    <GameItemCard className="w-2xs" key={game.id} game={game} />
                  </li>
                ))}
              </GameItemCardGrid>
            </GameItemGridGroupDateItem>
          ))}
        </GameItemGridGroupDate>
      )}
    </>
  )
}

export function QuartasGamesTab() {
  const games = useListGames({ fase: 'QUARTAS', status: 'FUTURO' })

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
                  <li key={game.id}>
                    <GameItemCard className="w-2xs" key={game.id} game={game} />
                  </li>
                ))}
              </GameItemCardGrid>
            </GameItemGridGroupDateItem>
          ))}
        </GameItemGridGroupDate>
      )}
    </>
  )
}

export function SemiGamesTab() {
  const games = useListGames({ fase: 'SEMI', status: 'FUTURO' })

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
                  <li key={game.id}>
                    <GameItemCard className="w-2xs" key={game.id} game={game} />
                  </li>
                ))}
              </GameItemCardGrid>
            </GameItemGridGroupDateItem>
          ))}
        </GameItemGridGroupDate>
      )}
    </>
  )
}

export function TerceiroGamesTab() {
  const games = useListGames({ fase: 'TERCEIRO', status: 'FUTURO' })

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
                  <li key={game.id}>
                    <GameItemCard className="w-2xs" key={game.id} game={game} />
                  </li>
                ))}
              </GameItemCardGrid>
            </GameItemGridGroupDateItem>
          ))}
        </GameItemGridGroupDate>
      )}
    </>
  )
}

export function FinalsGamesTab() {
  const games = useListGames({ fase: 'FINAL', status: 'FUTURO' })

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
                  <li key={game.id}>
                    <GameItemCard className="w-2xs" key={game.id} game={game} />
                  </li>
                ))}
              </GameItemCardGrid>
            </GameItemGridGroupDateItem>
          ))}
        </GameItemGridGroupDate>
      )}
    </>
  )
}
