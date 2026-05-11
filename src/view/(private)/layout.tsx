import { createFileRoute, Outlet } from '@tanstack/react-router'
import { LogOutIcon } from 'lucide-react'
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
import { removeStorageAuth } from '@/helpers/auth'
import { SidebarRoutes } from './-components/sidebar-routes'

export const Route = createFileRoute('/(private)')({
  component: PrivateLayout,
})

function PrivateLayout() {
  function handleLogout() {
    removeStorageAuth()
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
      <main className="min-w-0 flex-1 flex flex-col p-4">
        <Outlet />
      </main>
    </SidebarProvider>
  )
}
