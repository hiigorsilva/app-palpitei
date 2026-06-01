import { Link } from '@tanstack/react-router'
import { ArrowRightIcon, CalendarDaysIcon } from 'lucide-react'
import type { ComponentProps } from 'react'
import { formatDateWithoutYear } from '@/helpers/date'
import { getFaseName } from '@/helpers/games'
import { cn } from '@/lib/utils'
import type { IGame } from '@/services/games/type'
import { IconApostaTooltip } from './icon-aposta-tooltip'
import { Card } from './ui/card'

type NextGamesProps = ComponentProps<'ul'> & {
  nextGames: IGame[]
}

export function NextGames({ nextGames, className, ...props }: NextGamesProps) {
  return (
    <ul
      className={cn(
        'w-full flex flex-nowrap items-stretch gap-3 overflow-x-auto p-1',
        className
      )}
      {...props}
    >
      {nextGames.map(game => (
        <Link
          key={game.id}
          to="/jogos/$gameId"
          params={{ gameId: game.id }}
          className="group/link block min-fit focus-visible:outline-none"
        >
          <Card className="relative h-full gap-3 rounded-lg p-4 transition group-hover/link:-translate-y-0.5 group-hover/link:ring-primary/30 group-hover/link:shadow-sm group-focus-visible/link:ring-3 group-focus-visible/link:ring-ring/50">
            {game.has_palpite && (
              <IconApostaTooltip
                usouCartaDobroPontos={game.usou_carta_dobro_pontos}
              />
            )}

            <div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
              <CalendarDaysIcon className="size-3.5 shrink-0" />
              <span className="truncate">
                {formatDateWithoutYear(game.data_hora)}
              </span>
              <span className="size-1 rounded-full bg-muted-foreground/40" />
              <span className="truncate">{getFaseName(game.fase)}</span>
            </div>

            <div className="flex justify-center items-center gap-2">
              <span className="w-fit font-medium text-nowrap truncate text-sm text-foreground text-right ">
                {game.team_a}
              </span>
              <span className="rounded-md bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground">
                x
              </span>
              <span className="w-fit font-medium text-nowrap truncate text-sm text-foreground text-left">
                {game.team_b}
              </span>
            </div>
          </Card>
        </Link>
      ))}
      <Link
        to="/jogos"
        className="group/link block min-w-36 focus-visible:outline-none"
      >
        <Card className="h-full cursor-pointer items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium text-muted-foreground transition group-hover/link:-translate-y-0.5 group-hover/link:ring-primary/30 group-hover/link:text-foreground group-hover/link:shadow-sm group-focus-visible/link:ring-3 group-focus-visible/link:ring-ring/50">
          Ver todos
          <ArrowRightIcon className="size-4" />
        </Card>
      </Link>
    </ul>
  )
}
