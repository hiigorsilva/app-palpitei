import type { ReactNode } from 'react'
import { TitleContainer } from '@/components/title-container'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

// Root: Controla o Grid
interface GroupGridProps {
  children: ReactNode
  className?: string
}
const GroupGrid = ({ children, className }: GroupGridProps) => (
  <div
    className={cn(
      'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
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
  name: string
  logo?: string | null
}
const GroupTeam = ({ name, logo }: GroupTeamProps) => (
  <li className="flex items-center text-sm font-medium p-1 rounded transition-colors">
    <img
      src={logo ?? 'https://loremflickr.com/320/240?random=1'}
      alt={name}
      className="w-6 h-6 mr-3 bg-muted-foreground/10 object-contain shrink-0"
    />

    <span className="truncate">{name}</span>
  </li>
)

// Exportando como um único objeto para facilitar o uso (Opcional)
export const Group = {
  Grid: GroupGrid,
  Root: GroupRoot,
  Team: GroupTeam,
}
