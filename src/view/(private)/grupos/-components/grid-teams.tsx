import { StarIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { TitleContainer } from '@/components/title-container'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { getCountryCodeFromEmoji, imagesUrl } from '@/helpers/strings'
import { cn } from '@/lib/utils'
import type { IGrupo } from '@/services/grupos/type'

// Root: Controla o Grid
interface GroupGridProps {
  children: ReactNode
  className?: string
}
const GroupGrid = ({ children, className }: GroupGridProps) => (
  <div
    className={cn(
      'h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
      className
    )}
  >
    {children}
  </div>
)

// Container: O Card do Grupo
interface GroupRootProps {
  children: ReactNode
  title: string
}
const GroupRoot = ({ children, title }: GroupRootProps) => (
  <div className="flex flex-col gap-3 border p-4 rounded-lg shadow-sm bg-card">
    <TitleContainer className="font-semibold text-xs text-muted-foreground uppercase">
      Grupo {title}
    </TitleContainer>
    <Separator />
    <ul className="space-y-3">{children}</ul>
  </div>
)

// Item: A linha do time
interface GroupTeamProps {
  team: IGrupo
}
const GroupTeam = ({ team }: GroupTeamProps) => {
  const flagCode = team.flag_icon
    ? getCountryCodeFromEmoji(team.flag_icon?.toLocaleLowerCase())
    : null

  return (
    <div className="w-full flex items-center text-sm font-medium p-1 rounded transition-colors">
      <img
        src={
          flagCode
            ? `/country-flags/${flagCode}.webp`
            : imagesUrl.flagPlaceholder.url
        }
        alt={team.name}
        className="aspect-video w-6 mr-3 bg-muted-foreground/10 rounded-xs object-cover ring-1 ring-border shrink-0"
      />

      <span className="inline-flex truncate mr-auto">{team.name}</span>

      {team.isPalpiteCampeao && (
        <Tooltip>
          <TooltipTrigger>
            <div className="w-fit h-fit p-1 border border-green-500/50 bg-green-500/15 rounded-full">
              <StarIcon strokeWidth={1.3} className="size-4 text-green-500" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Seu palpite para o Campeão da Copa</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  )
}

// Exportando como um único objeto para facilitar o uso (Opcional)
export const Group = {
  Grid: GroupGrid,
  Root: GroupRoot,
  Team: GroupTeam,
}
