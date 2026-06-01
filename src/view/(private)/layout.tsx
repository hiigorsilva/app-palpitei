import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { LogOutIcon } from 'lucide-react'
import { type ComponentProps, useEffect, useMemo, useState } from 'react'
import { Loading } from '@/components/loading'
import { NotFound } from '@/components/not-found'
import { TitleContainer } from '@/components/title-container'
import { Avatar, AvatarBadge, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { DateNow } from '@/helpers/date'
import { cn } from '@/lib/utils'
import { useGetUserId } from '@/services/users/query'
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

type CountdownToStartProps = ComponentProps<'div'> & {}

export function CountdownToStart({
  className,
  ...props
}: CountdownToStartProps) {
  const [open, setOpen] = useState(true)
  const [now, setNow] = useState(() => DateNow())

  const firstGameDate = '2026-06-09T16:00:00-03:00'
  const isCountdownFinished = dayjs(firstGameDate).diff(dayjs(now)) <= 0

  if (isCountdownFinished) return null

  const remaining = useMemo(() => {
    if (!firstGameDate) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalMs: 0,
      }
    }

    const diff = Math.max(dayjs(firstGameDate).diff(dayjs(now)), 0)
    const totalSeconds = Math.floor(diff / 1000)

    return {
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
      totalMs: diff,
    }
  }, [now])

  const blocks = [
    { label: 'Dias', value: remaining.days },
    { label: 'Horas', value: remaining.hours },
    { label: 'Minutos', value: remaining.minutes },
    { label: 'Segundos', value: remaining.seconds },
  ]

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(DateNow())
    }, 1000)
    return () => window.clearInterval(interval)
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={cn(
          'overflow-hidden border-border/60 p-0 sm:max-w-2xl',
          className
        )}
        {...props}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.18),transparent_34%),linear-gradient(135deg,hsl(var(--muted)/0.7),transparent_45%)]" />
          <div className="relative space-y-6 p-6 sm:p-8">
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-xl sm:text-2xl">
                Contagem Regressiva
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Falta pouco para o primeiro jogo. O cronômetro zera no horário
                de Brasília.
              </p>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {blocks.map(block => (
                <div
                  key={block.label}
                  className="rounded-2xl border border-border/70 bg-background/80 px-4 py-5 text-center shadow-sm backdrop-blur"
                >
                  <div className="text-3xl font-semibold tracking-tight tabular-nums text-foreground sm:text-4xl">
                    {String(block.value).padStart(2, '0')}
                  </div>
                  <div className="mt-1 text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
                    {block.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <span>
                A estreia da Copa do Mundo está marcada para o dia 09 de Junho
                às 16h.
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
