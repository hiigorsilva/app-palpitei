import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'
import { useGetUserId } from '@/services/users/query'
import type { IUser } from '@/services/users/type'
import iconVerifyProfile from '/icons/profile-verify.svg'
import { Badge } from './ui/badge'
import { Card } from './ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Separator } from './ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

type UserDetailsCardProps = ComponentProps<'div'> & {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: IUser | null
  className?: string
}

export function UserDetailsCard({
  user: userData,
  open,
  onOpenChange: setOpen,
  className,
  ...props
}: UserDetailsCardProps) {
  if (!userData) return <div>Carregando...</div>

  const { data } = useGetUserId(userData.id)
  if (!data) return <div>Carregando...</div>
  const user = {
    ...data,
    bonus_concedido: 100,
    jogos_apostados: 10,
    nivel_atual: 'Platina',
    percentual: 50,
    proximo_nivel: {
      nivel: 'Diamante',
      bonusPontos: 200,
      minimoPercentual: 70,
    },
    total_jogos: 20,
  }

  function getBadgeColor(nivel: string) {
    switch (nivel) {
      case 'Bronze':
        return 'bg-orange-500/20 text-orange-500'
      case 'Prata':
        return 'bg-gray-500/20 text-gray-500'
      case 'Ouro':
        return 'bg-yellow-500/20 text-yellow-500'
      case 'Platina':
        return 'bg-blue-500/20 text-blue-500'
      case 'Diamante':
        return 'bg-purple-500/20 text-purple-500'
      default:
        return 'bg-muted text-foreground'
    }
  }

  function getProgressColor(nivel: string) {
    switch (nivel) {
      case 'Bronze':
        return 'bg-orange-500'
      case 'Prata':
        return 'bg-gray-500'
      case 'Ouro':
        return 'bg-yellow-500'
      case 'Platina':
        return 'bg-blue-500'
      case 'Diamante':
        return 'bg-purple-500'
      default:
        return 'bg-muted'
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={cn('min-w-80 w-fit flex flex-col gap-3', className)}
        {...props}
      >
        <DialogHeader>
          <DialogTitle className={'text-base'}>
            Detalhes de {user.name}
          </DialogTitle>
          <DialogDescription>Informações do participante</DialogDescription>
        </DialogHeader>

        <Card
          className={cn(
            'min-w-60 w-full flex flex-col gap-0 rounded-lg p-0 shadow-2xl shadow-foreground/5',
            className
          )}
          {...props}
        >
          <div className="relative w-full h-36 rounded bg-muted">
            <img
              className="absolute w-full h-full object-cover"
              src="https://www.flagcolorcodes.com/data/flag-of-brazil.png"
              alt="Bandeira do Brasil"
            />
          </div>
          <div className="flex flex-col gap-2 p-4">
            {/* NAME */}
            <div className="flex justify-between items-center gap-6">
              <div className="flex justify-center items-center gap-2">
                <h3 className="font-semibold text-sm tracking-tight">
                  {user.name}
                </h3>
                <img
                  className="relative size-3"
                  src={iconVerifyProfile}
                  alt="Verified Profile"
                />
              </div>
              <div className="flex justify-center items-center gap-1">
                <Badge
                  className={`w-fit px-2 ${getBadgeColor(user.nivel_atual)}`}
                >
                  {user.nivel_atual}
                </Badge>
              </div>
            </div>
            <Separator />
            {/* INFOS */}
            <div className="grid grid-cols-3 justify-between">
              <div className="w-full text-center">
                <h4 className="text-xs text-muted-foreground">Jogos</h4>
                <p className="font-semibold text-sm text-foreground tracking-tight">
                  {user.total_jogos}
                </p>
              </div>
              <div className="w-full text-center">
                <h4 className="text-xs text-muted-foreground">Apostados</h4>
                <p className="font-semibold text-sm text-foreground tracking-tight">
                  {user.jogos_apostados}
                </p>
              </div>
              <div className="w-full text-center">
                <h4 className="text-xs text-muted-foreground">Bônus</h4>
                <p className="font-semibold text-sm text-foreground tracking-tight">
                  {user.bonus_concedido}
                </p>
              </div>
            </div>

            <div className="w-full flex flex-col gap-1">
              <div className="flex justify-between items-center gap-6">
                <span className="inline-flex text-xs text-muted-foreground">
                  {user.nivel_atual}
                </span>
                <span className="inline-flex text-xs text-muted-foreground">
                  {user.proximo_nivel.nivel}
                </span>
              </div>
              <Tooltip>
                <TooltipTrigger>
                  <div className="w-full h-2 bg-muted rounded-full">
                    <div
                      className={`h-full ${getProgressColor(user.nivel_atual)} rounded-full`}
                      style={{
                        width: `${user.percentual}%`,
                      }}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">{user.percentual}%</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
