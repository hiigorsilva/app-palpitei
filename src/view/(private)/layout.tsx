import { createFileRoute, Outlet } from '@tanstack/react-router'
import { LayoutDashboardIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarProvider,
} from '@/components/ui/sidebar'

export const Route = createFileRoute('/(private)')({
  component: PrivateLayout,
})

function PrivateLayout() {
  const navigate = Route.useNavigate()

  const route = {
    resumePage: () => navigate({ to: '/' }),
    groupsPage: () => navigate({ to: '/grupos' }),
    gamesPage: () => navigate({ to: '/jogos' }),
    finalsPage: () => navigate({ to: '/jogos/finais' }),
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <h1 className="text-2xl font-bold">Palpitei</h1>
        </SidebarHeader>
        <Separator />
        <SidebarContent>
          <SidebarGroup>
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
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
      <main className="w-full flex-auto flex flex-col p-6 bg-yellow-100">
        <Outlet />
      </main>
    </SidebarProvider>
  )
}
