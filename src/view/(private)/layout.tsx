import { createFileRoute, Outlet } from '@tanstack/react-router'
import { TitleContainer } from '@/components/title-container'
import { Separator } from '@/components/ui/separator'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarProvider,
} from '@/components/ui/sidebar'
import { SidebarRoutes } from './-components/sidebar-routes'

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
          <TitleContainer>Palpitei</TitleContainer>
        </SidebarHeader>
        <Separator />
        <SidebarContent className="w-full">
          <SidebarGroup>
            <SidebarRoutes route={route} />
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <main className="w-full flex-auto flex flex-col p-6 bg-yellow-100">
        <Outlet />
      </main>
    </SidebarProvider>
  )
}
