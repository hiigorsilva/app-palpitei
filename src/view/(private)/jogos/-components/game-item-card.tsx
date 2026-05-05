import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { formatDateTime } from '@/helpers/date'
import type { IGame } from '@/services/games/type'

type Props = {
  game: IGame
}
export function GameItemCard({ game }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-center items-center gap-3">
          <div>{game.team_a}</div>
          <div className="flex justify-center items-center size-6 border rounded bg-muted-foreground/10 text-foreground text-sm">
            {game.gols_a ? game.gols_a : '-'}
          </div>
          <div>vs</div>
          <div className="flex justify-center items-center size-6 border rounded bg-muted-foreground/10 text-foreground text-sm">
            {game.gols_b ? game.gols_b : '-'}
          </div>
          <div>{game.team_b}</div>
        </CardTitle>
        <CardDescription className="text-center">
          Fase de {game.fase.toLocaleLowerCase()} -{' '}
          {formatDateTime(game.data_hora)}
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
