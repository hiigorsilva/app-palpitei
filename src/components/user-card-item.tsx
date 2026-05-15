import {
  AwardIcon,
  CoinsIcon,
  GemIcon,
  HandHelpingIcon,
  SparklesIcon,
  StarIcon,
  TargetIcon,
} from 'lucide-react'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'
import { useListNiveisBonus } from '@/services/bonus/query'
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
  if (!user) return <div>Carregando Usuário...</div>
  if (!niveisBonus) return <div>Carregando Níveis de Bônus...</div>

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
          <CardHeader className="bg-background p-6">
            <div className="flex items-center justify-between">
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
              <div className="bg-muted rounded-lg p-3 text-center space-y-1">
                <HandHelpingIcon className="size-5 text-muted-foreground mx-auto" />
                <div>
                  <p className="text-xl font-semibold text-foreground">
                    {/* {statistics?.total_apostas || 0} */}2
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Apostas feitas
                  </p>
                </div>
              </div>
              <div className="bg-muted rounded-lg p-3 text-center space-y-1">
                <AwardIcon className="size-5 text-muted-foreground mx-auto" />
                <div>
                  <p className="text-xl font-semibold text-foreground">
                    {/* {statistics.position || '-'}º */}
                    1º
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Posição no Ranking
                  </p>
                </div>
              </div>
              <div className="bg-muted rounded-lg p-3 text-center space-y-1">
                <TargetIcon className="size-5 text-muted-foreground mx-auto" />
                <div>
                  <p className="text-xl font-semibold text-foreground">
                    {/* {statistics.position || '-'}º */}1
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Total de Acertos
                  </p>
                </div>
              </div>
              <div className="bg-muted rounded-lg p-3 text-center space-y-1">
                <CoinsIcon className="size-5 text-muted-foreground mx-auto" />
                <div>
                  <p className="text-xl font-semibold text-foreground">
                    {/* {statistics.position || '-'}º */}
                    {user.carta_dobro_pontos}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Pts Dobro Restantes
                  </p>
                </div>
              </div>
              <div className="bg-muted rounded-lg p-3 text-center space-y-1">
                <GemIcon className="size-5 text-muted-foreground mx-auto" />
                <div>
                  <p className="text-xl font-semibold text-foreground">32</p>
                  <p className="text-xs text-muted-foreground">Total pontos</p>
                </div>
              </div>
              <div className="bg-muted rounded-lg p-3 text-center space-y-1">
                <SparklesIcon className="size-5 text-muted-foreground mx-auto" />
                <div>
                  <p className="text-xl font-semibold text-foreground">{47}%</p>
                  <p className="text-xs text-muted-foreground">
                    Taxa de Acertos
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
