import { useNavigate, useRouterState } from '@tanstack/react-router'
import {
  CalendarIcon,
  LayoutDashboardIcon,
  ShieldIcon,
  TrophyIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export function SidebarRoutes() {
  const navigate = useNavigate()
  const currentPath = useRouterState({
    select: state => state.location.pathname,
  })

  const links = [
    {
      label: 'Resumo',
      icon: <LayoutDashboardIcon />,
      onClick: () => navigate({ to: '/' }),
      path: '/',
    },
    {
      label: 'Calendário',
      icon: <CalendarIcon />,
      onClick: () => navigate({ to: '/jogos' }),
      path: '/jogos',
    },
    {
      label: 'Mata-Mata',
      icon: <TrophyIcon />,
      onClick: () => navigate({ to: '/jogos/finais' }),
      path: '/jogos/finais',
    },
    {
      label: 'Grupos e Seleções',
      icon: <ShieldIcon />,
      onClick: () => navigate({ to: '/grupos' }),
      path: '/grupos',
    },
  ]

  const activePath = links
    .map(link => link.path)
    .sort((a, b) => b.length - a.length)
    .find(path =>
      path === '/'
        ? currentPath === path
        : currentPath === path || currentPath.startsWith(`${path}/`)
    )

  function getStyleButtonMenu(path: string) {
    const isActive = activePath === path
    return isActive
      ? 'bg-foreground/10 transition hover:bg-foreground/20'
      : 'bg-transparent transition hover:bg-foreground/10'
  }
  return (
    <>
      {links.map(link => (
        <Button
          key={link.label}
          className={`min-h-10 h-fit w-full justify-start text-foreground py-3 cursor-pointer ${getStyleButtonMenu(link.path)}`}
          variant="ghost"
          onClick={link.onClick}
        >
          {link.icon}
          {link.label}
        </Button>
      ))}
    </>
  )
}
