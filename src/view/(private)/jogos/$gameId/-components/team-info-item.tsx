import type { ComponentProps } from 'react'
import { getCountryCodeFromEmoji, imagesUrl } from '@/helpers/strings'
import { cn } from '@/lib/utils'
import type { IGame } from '@/services/games/type'

type TeamInfoItemProps = ComponentProps<'li'> & {
  game: IGame
  team: 'a' | 'b'
}

export function TeamInfoItem({
  game,
  team,
  className,
  ...props
}: TeamInfoItemProps) {
  const teamInfo = team === 'a' ? game.team_a_info : game.team_b_info
  const flagCode = teamInfo?.flag_icon
    ? getCountryCodeFromEmoji(teamInfo.flag_icon)
    : null
  const teamName = team === 'a' ? game.team_a : game.team_b

  return (
    <li
      className={cn(
        'relative flex min-w-0 flex-col items-center justify-start gap-2 text-center',
        className
      )}
      {...props}
    >
      <div className="relative aspect-video min-w-40 w-fit h-auto overflow-hidden rounded-md bg-muted ring-1 ring-ring/40 shadow-sm">
        <img
          className="absolute object-cover w-full h-full"
          src={
            flagCode
              ? `/country-flags/${flagCode}.webp`
              : imagesUrl.flagPlaceholder.url
          }
          alt={teamName}
        />
      </div>
      <h2 className="max-w-full truncate font-semibold text-base text-foreground sm:text-lg">
        {teamName}
      </h2>
    </li>
  )
}
