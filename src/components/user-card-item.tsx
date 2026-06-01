import {
  CalendarIcon,
  CheckCircle2Icon,
  ClockIcon,
  GiftIcon,
  SparklesIcon,
  TargetIcon,
  TrendingUpIcon,
  ZapIcon,
} from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import { formatDate } from '@/helpers/date'
import { cn } from '@/lib/utils'
import { useGetBetsByUserId } from '@/services/bets/query'
import type { IBetExpanded } from '@/services/bets/type'
import { useGetUserId } from '@/services/users/query'
import type { IUser } from '@/services/users/type'
import { Badge } from './ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Progress } from './ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

type UserDetailsCardProps = ComponentProps<'div'> & {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: IUser | null
  position?: number
  className?: string
}

function getPositionStyles(position: number) {
  switch (position) {
    case 1:
      return {
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        text: 'text-amber-500',
        icon: 'text-amber-500',
      }
    case 2:
      return {
        bg: 'bg-slate-400/10',
        border: 'border-slate-400/30',
        text: 'text-slate-400',
        icon: 'text-slate-400',
      }
    case 3:
      return {
        bg: 'bg-orange-600/10',
        border: 'border-orange-600/30',
        text: 'text-orange-600',
        icon: 'text-orange-600',
      }
    default:
      return {
        bg: 'bg-muted/50',
        border: 'border-border',
        text: 'text-muted-foreground',
        icon: 'text-muted-foreground',
      }
  }
}

function getLevelColor(nivel: string) {
  const lowerNivel = nivel.toLowerCase()
  if (lowerNivel.includes('lendário') || lowerNivel.includes('mestre')) {
    return 'bg-amber-500/20 text-amber-500 border-amber-500/30'
  }
  if (lowerNivel.includes('expert') || lowerNivel.includes('ouro')) {
    return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30'
  }
  if (lowerNivel.includes('avançado') || lowerNivel.includes('prata')) {
    return 'bg-slate-400/20 text-slate-500 border-slate-400/30'
  }
  if (lowerNivel.includes('intermediário') || lowerNivel.includes('bronze')) {
    return 'bg-orange-500/20 text-orange-600 border-orange-500/30'
  }
  return 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30'
}

export function UserDetailsCard({
  user: userData,
  open,
  onOpenChange: setOpen,
  position = 1,
  className,
  ...props
}: UserDetailsCardProps) {
  const { data: user } = useGetUserId(userData?.id)
  const bets = useGetBetsByUserId(userData?.id)
  if (!user) return null

  const progressoParaProximoNivel = user.proximo_nivel
    ? user.proximo_nivel.minimoPercentual > 0
      ? Math.min(
          (user.percentual / user.proximo_nivel.minimoPercentual) * 100,
          100
        )
      : 0
    : 0

  const positionStyles = getPositionStyles(position)
  const levelColor = getLevelColor(user.nivel_atual)
  const userBets = bets.data ?? []
  const upcomingBets = userBets
    .filter(bet => !bet.finish_game)
    .sort(
      (a, b) =>
        new Date(a.data_hora).getTime() - new Date(b.data_hora).getTime()
    )
  const finishedBets = userBets
    .filter(bet => bet.finish_game)
    .sort(
      (a, b) =>
        new Date(b.data_hora).getTime() - new Date(a.data_hora).getTime()
    )
  const totalAcertos = finishedBets.filter(bet => bet.acertou).length
  const aproveitamento =
    finishedBets.length > 0
      ? Math.round((totalAcertos / finishedBets.length) * 100)
      : 0

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={cn('sm:max-w-md max-h-[85vh] overflow-y-auto', className)}
        {...props}
      >
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div
              className={cn(
                'flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl border',
                positionStyles.bg,
                positionStyles.border
              )}
            >
              <span
                className={cn('font-bold text-2xl -mr-2', positionStyles.text)}
              >
                {position}º
              </span>
            </div>
            <div className="min-w-0">
              <DialogTitle className="truncate text-xl">
                {user.name}
              </DialogTitle>
              <DialogDescription className="mt-1 flex items-center gap-2">
                <Badge variant="outline" className={cn('border', levelColor)}>
                  {user.nivel_atual}
                </Badge>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <InfoItem
              icon={<TargetIcon className="h-5 w-5 text-emerald-500" />}
              label="Cobertura de Apostas"
              value={`${user.percentual.toFixed(1)}%`}
            />
            <InfoItem
              icon={<SparklesIcon className="h-5 w-5 text-blue-500" />}
              label="Jogos Apostados"
              value={user.jogos_apostados}
            />
            <InfoItem
              icon={<CheckCircle2Icon className="h-5 w-5 text-green-500" />}
              label="Aproveitamento"
              value={
                finishedBets.length > 0
                  ? `${aproveitamento}%`
                  : 'Sem jogos encerrados'
              }
            />
            <InfoItem
              icon={<TrendingUpIcon className="h-5 w-5 text-orange-500" />}
              label="Acertos"
              value={`${totalAcertos}/${finishedBets.length}`}
            />
            <InfoItem
              icon={<GiftIcon className="h-5 w-5 text-pink-500" />}
              label="Bônus Concedido"
              value={user.bonus_concedido}
            />
          </div>

          <div className="rounded-lg border bg-card p-4">
            <h4 className="mb-3 flex items-center gap-2 font-medium">
              <ZapIcon className="h-4 w-4 text-amber-500" />
              Itens Especiais
            </h4>
            <div className="flex items-center justify-between gap-3 rounded-md bg-amber-500/10 p-3">
              <div className="flex min-w-0 items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/20">
                  <span className="text-lg">🃏</span>
                </div>
                <span className="truncate text-sm font-medium">
                  Carta Dobro de Pontos
                </span>
              </div>
              <Badge
                variant="secondary"
                className="bg-amber-500/20 text-amber-600"
              >
                {user.carta_dobro_pontos}x
              </Badge>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <h4 className="mb-3 font-medium">Progresso Total</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Do início ao topo</span>
                <span className="font-medium">
                  {user.percentual.toFixed(1)}%
                </span>
              </div>
              <Progress value={user.percentual} className="h-2" />
            </div>
          </div>

          {user.proximo_nivel && (
            <div className="rounded-lg border bg-card p-4">
              <h4 className="mb-3 font-medium">Progresso para Próximo Nível</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate text-sm text-muted-foreground capitalize">
                    <span>{user.nivel_atual.toLocaleLowerCase()}</span>
                    {' → '}
                    <span>{user.proximo_nivel.nivel.toLocaleLowerCase()}</span>
                  </span>
                  <span className="shrink-0 font-medium">
                    {progressoParaProximoNivel.toFixed(0)}%
                  </span>
                </div>
                <Progress value={progressoParaProximoNivel} className="h-2" />
                <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                  <span className="shrink-0">
                    {user.percentual.toFixed(1)}% /{' '}
                    {user.proximo_nivel.minimoPercentual}%
                  </span>
                  <p className="text-xs font-medium text-muted-foreground">
                    Bônus ao subir: +{user.proximo_nivel.bonusPontos} pontos
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-lg border bg-card p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h4 className="font-medium">Apostas realizadas</h4>
              <Badge variant="secondary">{userBets.length}</Badge>
            </div>

            <Tabs defaultValue="upcoming" className="gap-3">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upcoming">
                  <ClockIcon className="size-4" />
                  Futuras
                  <Badge variant="secondary" className="ml-1 px-1.5">
                    {upcomingBets.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="finished">
                  <CheckCircle2Icon className="size-4" />
                  Encerradas
                  <Badge variant="secondary" className="ml-1 px-1.5">
                    {finishedBets.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="mt-0">
                <ParticipantBetsList
                  bets={upcomingBets}
                  emptyMessage="Nenhuma aposta futura realizada."
                  isLoading={bets.isLoading}
                />
              </TabsContent>

              <TabsContent value="finished" className="mt-0">
                <ParticipantBetsList
                  bets={finishedBets}
                  emptyMessage="Nenhuma aposta encerrada ainda."
                  isLoading={bets.isLoading}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarIcon className="h-4 w-4" />
            <span>
              Participando desde{' '}
              {user.created_at
                ? formatDate(user.created_at)
                : 'data não informada'}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

type ParticipantBetsListProps = {
  bets: IBetExpanded[]
  emptyMessage: string
  isLoading: boolean
}

function ParticipantBetsList({
  bets,
  emptyMessage,
  isLoading,
}: ParticipantBetsListProps) {
  if (isLoading) {
    return (
      <div className="rounded-md bg-muted/50 p-3 text-sm text-muted-foreground">
        Carregando apostas...
      </div>
    )
  }

  if (bets.length === 0) {
    return (
      <div className="rounded-md bg-muted/50 p-3 text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
      {bets.map(bet => (
        <ParticipantBetItem key={bet.id} bet={bet} />
      ))}
    </div>
  )
}

type ParticipantBetItemProps = {
  bet: IBetExpanded
}

function ParticipantBetItem({ bet }: ParticipantBetItemProps) {
  const palpiteLabel = getPalpiteLabel(bet)

  return (
    <div className="rounded-md border bg-muted/30 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <p className="truncate text-sm font-medium">
            {bet.team_a} x {bet.team_b}
          </p>
        </div>
        {bet.usou_carta_dobro_pontos && (
          <Tooltip>
            <TooltipTrigger>
              <Badge
                variant="outline"
                className="shrink-0 border-amber-500/30 bg-amber-500/10 text-amber-600"
              >
                <SparklesIcon className="size-3" />
                2x
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Carta de dobro de pontos ativada</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Palpite:</span>
          <Badge
            variant="outline"
            className="border-primary/30 bg-primary/10 text-primary"
          >
            {palpiteLabel}
          </Badge>
        </div>

        {bet.finish_game ? (
          <Badge
            variant="outline"
            className={cn(
              bet.acertou
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600'
                : 'border-red-500/30 bg-red-500/10 text-red-600'
            )}
          >
            {bet.acertou ? `+${bet.pontos} pts` : '0 pts'}
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="border-blue-500/30 bg-blue-500/10 text-blue-600"
          >
            Em breve
          </Badge>
        )}
      </div>
    </div>
  )
}

function getPalpiteLabel(bet: IBetExpanded) {
  if (bet.palpite === 'A') return bet.team_a
  if (bet.palpite === 'B') return bet.team_b
  return 'Empate'
}

type InfoItemProps = ComponentProps<'div'> & {
  icon: ReactNode
  label: string
  value: string | number
}

function InfoItem({ icon, label, value, className, ...props }: InfoItemProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg bg-muted/50 p-3',
        className
      )}
      {...props}
    >
      {icon}
      <div className="min-w-0">
        <p className="truncate text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  )
}
