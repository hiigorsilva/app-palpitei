import { Card } from '@/components/ui/card'
import { formatDateWithoutYear } from '@/helpers/date'
import type { IGame } from '@/services/games/type'
import { TeamDisplayRow } from '../finais'

type GridFaseCardProps = {
  games: IGame[]
  fase: '16_AVOS' | 'OITAVAS' | 'QUARTAS' | 'SEMI' | 'FINAL'
  bracketRows: number
  roundIndex: number
  isVisible: boolean
  hasNextFase: boolean
}
export function GridFaseCard({
  games,
  fase,
  bracketRows,
  roundIndex,
  isVisible,
  hasNextFase,
}: GridFaseCardProps) {
  function getFaseTitle(fase: GridFaseCardProps['fase']) {
    switch (fase) {
      case '16_AVOS':
        return '16 Avos'
      case 'OITAVAS':
        return 'Oitavas'
      case 'QUARTAS':
        return 'Quartas'
      case 'SEMI':
        return 'Semi'
      case 'FINAL':
        return 'Final'
      default:
        return ''
    }
  }

  const rowSpan = 2 ** roundIndex
  const connectorPairs = hasNextFase
    ? games.reduce<{ key: string; startRow: number }[]>(
        (pairs, game, index) => {
          if (index % 2 !== 0) return pairs

          const nextGame = games[index + 1]
          if (!nextGame) return pairs

          pairs.push({
            key: `${game.id}-${nextGame.id}`,
            startRow: index * rowSpan + 1,
          })
          return pairs
        },
        []
      )
    : []

  if (!isVisible) return null

  return (
    <div className="max-w-48 w-full shrink-0">
      {games.length > 0 && (
        <>
          <h2 className="mb-4 text-sm font-semibold text-foreground">
            {getFaseTitle(fase)}
          </h2>
          <ul
            className="relative w-full grid gap-3"
            style={{
              gridTemplateRows: `repeat(${bracketRows}, minmax(6.75rem, max-content))`,
            }}
          >
            {connectorPairs.map(pair => (
              <li
                key={pair.key}
                aria-hidden="true"
                className="pointer-events-none relative z-0 col-start-1 w-full"
                style={{
                  gridRow: `${pair.startRow} / span ${rowSpan * 2}`,
                }}
              >
                <div className="absolute right-0 top-0 h-full w-8 translate-x-full text-border">
                  <span className="absolute left-0 top-1/4 h-px w-1/2 bg-current" />
                  <span className="absolute left-1/2 top-1/4 h-1/2 w-px bg-current" />
                  <span className="absolute left-0 top-3/4 h-px w-1/2 bg-current" />
                  <span className="absolute left-1/2 top-1/2 h-px w-1/2 bg-current" />
                </div>
              </li>
            ))}
            {games.map((game, index) => (
              <li
                key={game.id}
                className="relative z-10 col-start-1 w-full self-center"
                style={{
                  gridRow: `${index * rowSpan + 1} / span ${rowSpan}`,
                }}
              >
                <Card className="w-full gap-2 p-3">
                  <h3 className="text-xs text-muted-foreground">
                    {formatDateWithoutYear(game.data_hora)}
                  </h3>
                  <TeamDisplayRow game={game} team="a" />
                  <TeamDisplayRow game={game} team="b" />
                </Card>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
