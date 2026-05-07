import type { ComponentProps } from 'react'
import { Card } from '@/components/ui/card'
import { formatDateWithoutYear } from '@/helpers/date'
import { cn } from '@/lib/utils'
import type { IGame } from '@/services/games/type'
import { TeamDisplayRow } from '../finais'

type Props = ComponentProps<typeof Card> & {
  game: IGame
}
export function GameItemCard({ game, className, ...props }: Props) {
  return (
    <Card className={cn('w-48 min-w-0 gap-2 p-3', className)} {...props}>
      <h3 className="text-xs text-muted-foreground">
        {formatDateWithoutYear(game.data_hora)}
      </h3>
      <TeamDisplayRow game={game} team="a" />
      <TeamDisplayRow game={game} team="b" />
    </Card>
  )
}
