import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { formatDateWithoutYear } from '@/helpers/date'
import { getFaseName } from '@/helpers/games'
import type { IGame } from '@/services/games/type'
import { TeamInfoItem } from './team-info-item'

type DisplayGameProps = {
  game: IGame
}
export function DisplayGame({ game }: DisplayGameProps) {
  return (
    <Card className="flex flex-col justify-center items-center gap-3 bg-yellow-50">
      <span className="inline-flex text-sm text-muted-foreground tracking-tight">
        Copa do Mundo FIFA 2026 - {getFaseName(game.fase)}
      </span>
      <Badge variant={'secondary'} className="text-sm">
        {formatDateWithoutYear(game.data_hora, 'long')}
      </Badge>
      <ul className="grid grid-cols-3 gap-3 place-content-end">
        <TeamInfoItem game={game} team="a" />
        <div className="w-full flex flex-col justify-center items-center gap-2">
          <div className="w-full font-semibold text-4xl leading-none text-center">
            {game.gols_a ?? '4'} x {game.gols_b ?? '2'}
          </div>
          <span className="inline-flex font-normal text-base text-muted-foreground tracking-tight capitalize">
            {game.finish_game ? 'Encerrado' : 'Em breve'}
          </span>
        </div>
        <TeamInfoItem game={game} team="b" />
      </ul>
    </Card>
  )
}
