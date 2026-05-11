import type { ComponentProps } from 'react'
import type { IGame } from '@/services/games/type'

type TeamInfoItemProps = ComponentProps<'li'> & {
  game: IGame
  team: 'a' | 'b'
}

export function TeamInfoItem({ game, team }: TeamInfoItemProps) {
  return (
    <li className="flex flex-col justify-start items-center gap-2">
      {/* FLAG */}
      <div className="aspect-video w-60 h-auto bg-muted rounded ring-1 ring-ring"></div>
      <h2 className="font-semibold text-lg text-foreground text-nowrap">
        {team === 'a' ? game.team_a : game.team_b}
      </h2>
    </li>
  )
}
