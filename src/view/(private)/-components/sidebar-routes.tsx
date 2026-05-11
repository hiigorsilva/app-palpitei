import { useNavigate } from '@tanstack/react-router'
import { LayoutDashboardIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function SidebarRoutes() {
  const navigate = useNavigate()

  const links = [
    { label: 'Resumo', onClick: () => navigate({ to: '/' }) },
    { label: 'Calendário', onClick: () => navigate({ to: '/jogos' }) },
    {
      label: 'Mata-Mata',
      onClick: () => navigate({ to: '/jogos/finais' }),
    },
    { label: 'Grupos e Seleções', onClick: () => navigate({ to: '/grupos' }) },
  ]

  return (
    <>
      {links.map(link => (
        <Button
          key={link.label}
          className="min-h-10 h-fit w-full justify-start py-3 cursor-pointer"
          variant="ghost"
          onClick={link.onClick}
        >
          <LayoutDashboardIcon />
          {link.label}
        </Button>
      ))}
    </>
  )
}
