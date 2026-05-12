import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'
import type { IUserBonus } from '@/services/users/type'
import iconVerifyProfile from '/icons/profile-verify.svg'
import { Badge } from './ui/badge'
import { Card } from './ui/card'
import { Separator } from './ui/separator'

interface CardProfileProps extends ComponentProps<'div'> {
  user: IUserBonus
}

export function CardProfile({ user, className, ...props }: CardProfileProps) {
  return (
    <Card
      className={cn(
        'max-w-60 w-full flex flex-col gap-0 rounded-lg p-0 shadow-2xl shadow-foreground/5',
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
          <div className="flex justify-center items-center gap-1">
            <h3 className="font-semibold text-sm tracking-tight">
              {user.name}
            </h3>
            <img
              className="relative size-4"
              src={iconVerifyProfile}
              alt="Verified Profile"
            />
          </div>
          <div className="flex justify-center items-center gap-1">
            <Badge className={`w-fit px-2 ${getBadgeColor(user.nivel_atual)}`}>
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
          <div className="w-full h-2 bg-muted rounded-full">
            <div
              className={`h-full ${getProgressColor(user.nivel_atual)} rounded-full`}
              style={{
                width: `${user.percentual}%`,
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  )
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
