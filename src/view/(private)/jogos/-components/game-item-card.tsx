import { CircleDollarSignIcon } from 'lucide-react'
import type { ComponentProps } from 'react'
import { Card } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { formatDateWithoutYear } from '@/helpers/date'
import { cn } from '@/lib/utils'
import type { IGame } from '@/services/games/type'
import { TeamDisplayRow } from '../finais'

type Props = ComponentProps<typeof Card> & {
  game: IGame
}
export function GameItemCard({ game, className, ...props }: Props) {
  return (
    <Card
      className={cn('relative w-48 min-w-0 gap-2 p-3', className)}
      {...props}
    >
      {game.has_palpites && (
        <Tooltip>
          <TooltipTrigger>
            <div className="absolute top-0 right-0 p-1 rounded-bl-md bg-green-400/15">
              <CircleDollarSignIcon
                strokeWidth={1.2}
                className="size-4 text-green-600"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="xs">Esse jogo possui uma aposta ativa.</p>
          </TooltipContent>
        </Tooltip>
      )}
      <h3 className="text-xs text-muted-foreground">
        {formatDateWithoutYear(game.data_hora)}
      </h3>
      <TeamDisplayRow game={game} team="a" />
      <TeamDisplayRow game={game} team="b" />
    </Card>
  )
}
