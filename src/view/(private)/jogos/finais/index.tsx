import { createFileRoute } from '@tanstack/react-router'
import { Container } from '@/components/container'
import {
  useListFase16AvosGames,
  useListFaseFinalGames,
  useListFaseOitavasGames,
  useListFaseQuartasGames,
  useListFaseSemiGames,
} from '@/services/games/query'
import type { IGame } from '@/services/games/type'
import { GridFaseCard } from '../-components/grid-fase-card'

export const Route = createFileRoute('/(private)/jogos/finais/')({
  component: TournamentFinalGames,
})

function TournamentFinalGames() {
  const { data: games16Avos } = useListFase16AvosGames()
  const { data: gamesOitavas } = useListFaseOitavasGames()
  const { data: gamesQuartas } = useListFaseQuartasGames()
  const { data: gamesSemi } = useListFaseSemiGames()
  const { data: gamesFinal } = useListFaseFinalGames()

  const games = {
    fase_16avos: games16Avos ?? [],
    fase_oitavas: gamesOitavas ?? [],
    fase_quartas: gamesQuartas ?? [],
    fase_semi: gamesSemi ?? [],
    fase_final: gamesFinal ?? [],
  }

  const fases = [
    {
      fase: '16_AVOS' as const,
      games: games.fase_16avos,
      isVisible: Boolean(games16Avos),
    },
    {
      fase: 'OITAVAS' as const,
      games: games.fase_oitavas,
      isVisible: Boolean(gamesOitavas),
    },
    {
      fase: 'QUARTAS' as const,
      games: games.fase_quartas,
      isVisible: Boolean(gamesQuartas),
    },
    {
      fase: 'SEMI' as const,
      games: games.fase_semi,
      isVisible: Boolean(gamesSemi),
    },
    {
      fase: 'FINAL' as const,
      games: games.fase_final,
      isVisible: Boolean(gamesFinal),
    },
  ]

  const bracketRows = Math.max(
    ...fases.map((fase, index) => fase.games.length * 2 ** index),
    1
  )

  return (
    <Container>
      <section className="min-h-dvh h-fit w-full overflow-x-auto py-8 px-1">
        <div className="flex min-w-max items-start justify-start gap-8">
          {fases.map((fase, index) => (
            <GridFaseCard
              key={fase.fase}
              fase={fase.fase}
              games={fase.games}
              bracketRows={bracketRows}
              roundIndex={index}
              isVisible={fase.isVisible}
              hasNextFase={index < fases.length - 1}
            />
          ))}
        </div>
      </section>
    </Container>
  )
}

type Props = {
  game: IGame
  team: 'a' | 'b'
}
export function TeamDisplayRow({ game, team }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <div className="w-full flex justify-between items-center gap-1">
        <div className="w-16 h-6 relative rounded border bg-muted-foreground/10"></div>
        <p className="min-w-0 w-full truncate text-sm text-foreground">
          {team === 'a' ? game.team_a : game.team_b}
        </p>
        <div className="w-14 flex justify-center items-center text-sm text-foreground rounded border bg-muted-foreground/10">
          {team === 'a' ? (game.gols_a ?? '-') : (game.gols_b ?? '-')}
        </div>
      </div>
    </div>
  )
}
