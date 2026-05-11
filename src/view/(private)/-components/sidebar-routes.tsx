import { LayoutDashboardIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

type SidebarRoutesProps = {
  route: {
    resumePage: () => Promise<void>
    groupsPage: () => Promise<void>
    gamesPage: () => Promise<void>
    finalsPage: () => Promise<void>
  }
}

export function SidebarRoutes({ route }: SidebarRoutesProps) {
  return (
    <>
      <Button
        className="justify-start cursor-pointer"
        variant="ghost"
        onClick={route.resumePage}
      >
        <LayoutDashboardIcon />
        Resumo
      </Button>
      <Button
        className="justify-start cursor-pointer"
        variant="ghost"
        onClick={route.gamesPage}
      >
        <LayoutDashboardIcon />
        Jogos de Hoje
      </Button>
      <Button
        className="justify-start cursor-pointer"
        variant="ghost"
        onClick={route.gamesPage}
      >
        <LayoutDashboardIcon />
        Calendário de Jogos
      </Button>
      <Button
        className="justify-start cursor-pointer"
        variant="ghost"
        onClick={route.finalsPage}
      >
        <LayoutDashboardIcon />
        Chaveamento de Mata-Mata
      </Button>
      <Button
        className="justify-start cursor-pointer"
        variant="ghost"
        onClick={route.finalsPage}
      >
        <LayoutDashboardIcon />
        Bônus
      </Button>
      <Button
        className="justify-start cursor-pointer"
        variant="ghost"
        onClick={route.finalsPage}
      >
        <LayoutDashboardIcon />
        Participantes
      </Button>
    </>
  )
}
