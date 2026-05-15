import type { ComponentProps } from 'react'
import { getCountryCodeFromEmoji, imagesUrl } from '@/helpers/strings'
import type { IGame } from '@/services/games/type'

type TeamInfoItemProps = ComponentProps<'li'> & {
  game: IGame
  team: 'a' | 'b'
}

export function TeamInfoItem({ game, team }: TeamInfoItemProps) {
  const teamInfo = team === 'a' ? game.team_a_info : game.team_b_info
  const flagCode = teamInfo?.flag_icon
    ? getCountryCodeFromEmoji(teamInfo.flag_icon)
    : null
  const teamName = team === 'a' ? game.team_a : game.team_b

  return (
    <li className="flex flex-col justify-start items-center gap-2">
      {/* FLAG */}
      <div className="relative aspect-video w-48 h-auto bg-muted rounded ring-1 ring-ring">
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
      <h2 className="font-semibold text-lg text-foreground text-nowrap">
        {teamName}
      </h2>
    </li>
  )
}
