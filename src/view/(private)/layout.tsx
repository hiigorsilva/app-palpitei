import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { LogOutIcon, MenuIcon } from 'lucide-react'
import { useState } from 'react'
import { Loading } from '@/components/loading'
import { NotFound } from '@/components/not-found'
import { TitleContainer } from '@/components/title-container'
import { Avatar, AvatarBadge, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
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
import { useIsMobile } from '@/hooks/use-mobile'
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

  const [openMenuMobile, setOpenMenuMobile] = useState(false)

  const isMobile = useIsMobile()

  const auth = getStorageAuth()!
  const { data: user } = useGetUserId(auth.id)
  if (!user) return <Loading />

  function handleLogout() {
    logout()
    navigate({ to: '/login' })
  }

  function handleOpenMenuMobile() {
    setOpenMenuMobile(prev => !prev)
  }

  return (
    <>
      {isMobile ? (
        <header className="relative top-0 left-0 right-0 z-50 w-full flex justify-between items-center bg-background p-5 border-b border-border">
          <TitleContainer>Palpitei</TitleContainer>
          <Sheet open={openMenuMobile} onOpenChange={setOpenMenuMobile}>
            <SheetTrigger
              render={() => (
                <Button
                  variant={'outline'}
                  size={'icon'}
                  onClick={handleOpenMenuMobile}
                >
                  <MenuIcon />
                </Button>
              )}
            />
            <SheetContent className={'max-h-dvh h-full gap-1 pb-3 px-3'}>
              <SheetHeader>
                <SheetTitle>Palpitei</SheetTitle>
              </SheetHeader>
              <SidebarRoutes
                onOpenMenuMobile={() => setOpenMenuMobile(false)}
              />
              <div className="mt-auto flex flex-col items-start gap-3">
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
                  className="w-full text-sm text-red-500 transition hover:text-red-600 cursor-pointer"
                >
                  <LogOutIcon className="text-red-500" /> Sair
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </header>
      ) : (
        <SidebarProvider>
          <Sidebar>
            <SidebarHeader className="px-6 py-4">
              <TitleContainer>Palpitei</TitleContainer>
            </SidebarHeader>
            <Separator />

            <SidebarContent className="w-full">
              <SidebarGroup>
                <SidebarRoutes
                  onOpenMenuMobile={() => setOpenMenuMobile(false)}
                />
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
        </SidebarProvider>
      )}
      <main className="relative min-w-0 flex-1 flex flex-col p-4">
        <CountdownToStart />
        <Outlet />
      </main>
    </>
  )
}
