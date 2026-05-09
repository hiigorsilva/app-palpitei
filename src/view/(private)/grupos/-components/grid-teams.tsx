import type { ReactNode } from 'react'
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
  <div className="border p-4 rounded-lg shadow-sm bg-card">
    <h2 className="text-xl font-bold mb-4 border-b pb-2 text-primary">
      Grupo {title}
    </h2>
    <ul className="space-y-3">{children}</ul>
  </div>
)

// Item: A linha do time
interface GroupTeamProps {
  name: string
  logo?: string | null
}
const GroupTeam = ({ name, logo }: GroupTeamProps) => (
  <li className="flex items-center text-sm font-medium hover:bg-muted/50 p-1 rounded transition-colors">
    {logo && (
      <img
        src={logo}
        alt={name}
        className="w-6 h-6 mr-3 bg-muted-foreground/10 object-contain shrink-0"
      />
    )}
    <span className="truncate">{name}</span>
  </li>
)

// Exportando como um único objeto para facilitar o uso (Opcional)
export const Group = {
  Grid: GroupGrid,
  Root: GroupRoot,
  Team: GroupTeam,
}
