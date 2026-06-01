import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { LogOutIcon } from 'lucide-react'
import { Loading } from '@/components/loading'
import { NotFound } from '@/components/not-found'
import { TitleContainer } from '@/components/title-container'
import { Avatar, AvatarBadge, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
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
import { useGetUserId } from '@/services/users/query'
import { CountdownToStart } from './-components/countdown-to-start'
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

  const auth = getStorageAuth()!
  const { data: user } = useGetUserId(auth.id)
  if (!user) return <Loading />

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
          <div className="w-full flex items-center gap-2">
            <Avatar>
              <AvatarBadge className="bg-green-400 animate-pulse" />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="w-full flex justify-between items-center gap-1">
              <h2 className="font-semibold text-sm text-foreground">
                {user.name}
              </h2>
              <Badge className="text-xs text-primary bg-primary/10 capitalize">
                {user.nivel_atual.toLocaleLowerCase()}
              </Badge>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="text-sm text-red-500 transition hover:text-red-600 cursor-pointer"
          >
            <LogOutIcon className="text-red-500" /> Sair
          </Button>
        </SidebarFooter>
      </Sidebar>
      <main className="relative min-w-0 flex-1 flex flex-col p-4">
        <CountdownToStart />
        <Outlet />
      </main>
    </SidebarProvider>
  )
}
