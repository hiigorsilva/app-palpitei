import { Link, useNavigate } from '@tanstack/react-router'
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
  const navigate = useNavigate()

  function handleGoToAllGames() {
    navigate({ to: '/jogos' })
  }
  return (
    <ul
      className={cn(
        'w-full flex flex-nowrap justify-start items-center gap-3 p-1 overflow-x-auto',
        className
      )}
      {...props}
    >
      {nextGames.map(game => (
        <Link
          key={game.id}
          to="/jogos/$gameId"
          params={{ gameId: game.id }}
          className="transition hover:scale-[98%]"
        >
          <Card className="relative min-w-3xs w-fit flex flex-col gap-2 p-3">
            {game.has_palpite && <IconApostaTooltip />}
            <span className="block text-xs text-muted-foreground">
              {formatDateWithoutYear(game.data_hora)} - {getFaseName(game.fase)}
            </span>
            <div className="flex justify-start items-center gap-2">
              <span className="block text-sm text-foreground">
                {game.team_a}
              </span>
              <span className="block text-sm text-foreground">x</span>
              <span className="block text-sm text-foreground">
                {game.team_b}
              </span>
            </div>
          </Card>
        </Link>
      ))}
      <Card
        onClick={handleGoToAllGames}
        className="min-w-fit justify-center items-center text-sm text-nowrap text-muted-foreground px-3 cursor-pointer"
      >
        Ver todos os jogos
      </Card>
    </ul>
  )
}
