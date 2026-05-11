import { Link, useNavigate } from '@tanstack/react-router'
import { CircleDollarSignIcon } from 'lucide-react'
import type { ComponentProps } from 'react'
import { formatDateWithoutYear } from '@/helpers/date'
import { cn } from '@/lib/utils'
import type { IGame } from '@/services/games/type'
import { TitleContainer } from './title-container'
import { Card } from './ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

type NextGamesProps = ComponentProps<'ul'> & {
  nextGames: IGame[]
}

export function NextGames({ nextGames, className, ...props }: NextGamesProps) {
  const navigate = useNavigate()

  function handleGoToAllGames() {
    navigate({ to: '/jogos' })
  }
  return (
    <>
      <TitleContainer>Próximos Jogos</TitleContainer>
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
              {game.has_palpites && (
                <Tooltip>
                  <TooltipTrigger>
                    <div className="absolute top-0 right-0 p-1 rounded-bl-md bg-green-400/15">
                      <CircleDollarSignIcon
                        strokeWidth={1.2}
                        className="size-5 text-green-600"
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="xs">Esse jogo possui uma aposta ativa.</p>
                  </TooltipContent>
                </Tooltip>
              )}
              <span className="block text-xs text-muted-foreground">
                {formatDateWithoutYear(game.data_hora)} - {game.fase}
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
    </>
  )
}
