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
}
export function GridFaseCard({
  games,
  fase,
  bracketRows,
  roundIndex,
  isVisible,
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

  if (!isVisible) return null

  return (
    <div className="w-64 shrink-0">
      {games.length > 0 && (
        <>
          <h2 className="mb-4 text-sm font-semibold text-foreground">
            {getFaseTitle(fase)}
          </h2>
          <ul
            className="grid gap-3"
            style={{
              gridTemplateRows: `repeat(${bracketRows}, minmax(6.75rem, max-content))`,
            }}
          >
            {games.map((game, index) => (
              <li
                key={game.id}
                className="self-center"
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
