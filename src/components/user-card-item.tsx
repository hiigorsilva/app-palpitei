import {
  AwardIcon,
  CoinsIcon,
  GemIcon,
  HandHelpingIcon,
  SparklesIcon,
  StarIcon,
  TargetIcon,
} from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import { imagesUrl } from '@/helpers/strings'
import { cn } from '@/lib/utils'
import { useListNiveisBonus } from '@/services/bonus/query'
import { useStatistics } from '@/services/ranking/query'
import { useGetUserId } from '@/services/users/query'
import type { IUser } from '@/services/users/type'
import { Badge } from './ui/badge'
import { Card, CardContent, CardHeader } from './ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Progress } from './ui/progress'

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
  if (!userData) return <div>Carregando Usuário...</div>

  const { data: user } = useGetUserId(userData.id)
  const { data: niveisBonus } = useListNiveisBonus()
  const { data: statistics } = useStatistics(userData.id)

  if (!user) return <div>Carregando Usuário...</div>
  if (!niveisBonus) return <div>Carregando Níveis de Bônus...</div>
  if (!statistics) return <div>Carregando Estatísticas...</div>

  const { name, percentual, nivel_atual, bonus_concedido, proximo_nivel } = user

  const progressoParaProximoNivel =
    proximo_nivel.minimoPercentual > 0
      ? Math.min((percentual / proximo_nivel.minimoPercentual) * 100, 100)
      : 0

  const getCorNivel = (nivel: string): string => {
    const cores: Record<string, string> = {
      INICIANTE: 'bg-gray-500/20 text-gray-500',
      BRONZE: 'bg-orange-400/20 text-orange-400',
      PRATA: 'bg-slate-400/20 text-slate-400',
      OURO: 'bg-yellow-400/20 text-yellow-400',
      PLATINA: 'bg-cyan-400/20 text-cyan-400',
      DIAMANTE: 'bg-blue-400/20 text-blue-400',
    }
    return cores[nivel] || 'bg-gray-500/20 text-gray-500'
  }

  const getIconeNivel = (nivel: string): string => {
    const icones: Record<string, string> = {
      INICIANTE: '⚪',
      BRONZE: '🥉',
      PRATA: '🥈',
      OURO: '🥇',
      PLATINA: '🌀',
      DIAMANTE: '💎',
    }
    return icones[nivel] || '⚪'
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={cn(
          'min-w-lg w-fit max-h-3/4 h-full flex flex-col gap-3 overflow-y-hidden',
          className
        )}
        {...props}
      >
        <DialogHeader>
          <DialogTitle className={'text-base'}>
            Detalhes de Participante
          </DialogTitle>
          <DialogDescription>
            Veja informações sobre o participante
          </DialogDescription>
        </DialogHeader>

        <Card className="w-full gap-0 shadow-lg p-0 overflow-hidden overflow-y-auto">
          <CardHeader className="relative min-h-fit bg-background p-6 overflow-hidden">
            <div className="absolute z-10 inset-0 w-full h-full bg-background/75" />
            <img
              className="absolute top-0 left-0 z-0"
              src={imagesUrl.bannerProfileCard.url}
              alt={imagesUrl.bannerProfileCard.alt_text}
            />
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-3xl">
                  {getIconeNivel(nivel_atual)}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{name}</h3>
                  <Badge className={`${getCorNivel(nivel_atual)} mt-1`}>
                    {nivel_atual}
                  </Badge>
                </div>
              </div>
              {bonus_concedido > 0 && (
                <Badge variant="secondary" className="bg-green-500 text-white">
                  +{bonus_concedido}
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-5">
            {/* Progresso Total */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  Progresso Total
                </span>
                <span className="text-sm font-semibold text-muted-foreground">
                  {percentual}%
                </span>
              </div>
              <Progress value={percentual} className="h-2" />
            </div>

            {/* Próximo Nível */}
            <div className="flex flex-col gap-2 bg-muted border-0 rounded-lg p-4 space-y-2">
              {proximo_nivel.nivel !== null && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <StarIcon className="size-4 text-muted-foreground" />
                    <span className="text-sm font-semibold text-muted-foreground">
                      Próximo Nível
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className={`${getCorNivel(proximo_nivel.nivel)}`}
                  >
                    {proximo_nivel.nivel}
                  </Badge>
                </div>
              )}

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">
                    {percentual}% / {proximo_nivel.minimoPercentual}%
                  </span>
                  <span className="font-medium text-muted-foreground">
                    {progressoParaProximoNivel.toFixed(0)}% do caminho
                  </span>
                </div>
                <Progress
                  value={progressoParaProximoNivel}
                  className="h-1.5 bg-muted-foreground/10 rounded-full overflow-hidden"
                >
                  <div
                    className="bg-white transition-all h-full"
                    style={{ width: `${percentual}%` }}
                  />
                </Progress>
                <p className="text-xs text-muted-foreground font-medium">
                  +{proximo_nivel.bonusPontos} pontos de bônus
                </p>
              </div>
            </div>

            {/* Estatísticas de Jogos */}
            <div className="grid grid-cols-3 gap-3">
              <ItemStatisticsCard
                icon={<HandHelpingIcon className="size-5 text-primary/75" />}
                value={statistics?.total_apostas || 0}
                label="Apostas feitas"
              />
              <ItemStatisticsCard
                icon={<AwardIcon className="size-5 text-primary/75" />}
                value={statistics.position ? `${statistics.position}º` : '-'}
                label="Posição no Ranking"
              />
              <ItemStatisticsCard
                icon={<TargetIcon className="size-5 text-primary/75" />}
                value={statistics.acertos ? `${statistics.acertos}º` : '-'}
                label="Total de Acertos"
              />
              <ItemStatisticsCard
                icon={<CoinsIcon className="size-5 text-primary/75" />}
                value={user.carta_dobro_pontos}
                label="Pts Dobro Restantes"
              />
              <ItemStatisticsCard
                icon={<GemIcon className="size-5 text-primary/75" />}
                value={statistics.pontos_total || 0}
                label="Total pontos"
              />
              <ItemStatisticsCard
                icon={<SparklesIcon className="size-5 text-primary/75" />}
                value={statistics.taxa_acerto || 0}
                label="Taxa de Acertos"
              />
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}

type ItemStatisticsCardProps = ComponentProps<'div'> & {
  icon: ReactNode
  value: string | number
  label: string
}
function ItemStatisticsCard({
  icon,
  value,
  label,
  className,
  ...props
}: ItemStatisticsCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-1 bg-muted rounded-lg p-3 text-center',
        className
      )}
      {...props}
    >
      <div className="w-fit bg-primary/20 p-1 rounded">{icon}</div>
      <div>
        <p className="text-xl text-center font-semibold text-foreground">
          {value}
        </p>
        <p className="text-xs text-center text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}
