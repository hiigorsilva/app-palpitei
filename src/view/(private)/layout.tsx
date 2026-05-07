import { createFileRoute, Outlet } from '@tanstack/react-router'
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
            <Button variant="ghost" onClick={route.gamesPage}>
              Calendário de Jogos
            </Button>
            <Button variant="ghost" onClick={route.gamesPage}>
              Jogos de Hoje
            </Button>
            <Button variant="ghost" onClick={route.finalsPage}>
              Chaveamento de Mata-Mata
            </Button>
            <Button variant="ghost" onClick={route.finalsPage}>
              Bônus
            </Button>
            <Button variant="ghost" onClick={route.finalsPage}>
              Usuários
            </Button>
            <Button variant="ghost" onClick={route.finalsPage}>
              Estatísticas
            </Button>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
      <Outlet />
    </SidebarProvider>
  )
}
