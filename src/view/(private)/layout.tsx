import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { LogOutIcon } from 'lucide-react'
import { Loading } from '@/components/loading'
import { NotFound } from '@/components/not-found'
import { TitleContainer } from '@/components/title-container'
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
import { useAuth } from '@/contexts/auth'
import { getStorageAuth } from '@/helpers/auth'
import { SidebarRoutes } from './-components/sidebar-routes'

export const Route = createFileRoute('/(private)')({
  beforeLoad: () => {
    if (!getStorageAuth()) {
      throw redirect({ to: '/login' })
    }
  },
  loader: () => <Loading />,
  notFoundComponent: () => <NotFound />,
  component: PrivateLayout,
})

function PrivateLayout() {
  const navigate = Route.useNavigate()
  const { logout } = useAuth()

  function handleLogout() {
    logout()
    navigate({ to: '/login' })
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="px-6 py-4">
          <TitleContainer>Palpitei</TitleContainer>
        </SidebarHeader>
        <Separator />

        <SidebarContent className="w-full">
          <SidebarGroup>
            <SidebarRoutes />
          </SidebarGroup>
        </SidebarContent>

        <Separator />
        <SidebarFooter>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="text-sm text-red-500 transition hover:text-red-600 cursor-pointer"
          >
            <LogOutIcon className="text-red-500" /> Sair
          </Button>
        </SidebarFooter>
      </Sidebar>
      <main className="relative min-w-0 flex-1 flex flex-col p-4">
        <Outlet />
      </main>
    </SidebarProvider>
  )
}
