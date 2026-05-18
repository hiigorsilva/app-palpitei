import {
  CalendarIcon,
  CheckCircle2Icon,
  PencilIcon,
  SparklesIcon,
  XCircleIcon,
} from 'lucide-react'
import type { ComponentProps } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { formatDateWithoutYear } from '@/helpers/date'
import { getCountryCodeFromEmoji, imagesUrl } from '@/helpers/strings'
import { cn } from '@/lib/utils'
import type { IBet } from '@/services/bets/type'
import { CreateApostaDrawer } from './create-aposta-drawer'

type ApostaCardItemProps = ComponentProps<'div'> & {
  bet: IBet
}

export function ApostaCardItem({
  bet,
  className,
  ...props
}: ApostaCardItemProps) {
  const gameDate = new Date(bet.data_hora)
  const canEdit = gameDate > new Date() && !bet.finish_game

  // Determinar o palpite em texto
  const getPalpiteText = () => {
    if (bet.palpite === 'A') return bet.team_a
    if (bet.palpite === 'B') return bet.team_b
    return 'Empate'
  }

  const flagCodeA = bet.team_a_info?.flag_icon
    ? getCountryCodeFromEmoji(bet.team_a_info.flag_icon?.toLocaleLowerCase())
    : null

  const flagCodeB = bet.team_b_info?.flag_icon
    ? getCountryCodeFromEmoji(bet.team_b_info.flag_icon?.toLocaleLowerCase())
    : null

  return (
    <Card
      className={cn(
        'relative p-3 overflow-hidden transition-all duration-200 hover:shadow-md',
        !bet.finish_game && bet.acertou && 'border-green-500/30',
        !bet.finish_game && !bet.acertou && 'border-red-500/30',
        className
      )}
      {...props}
    >
      {/* Indicador lateral de status */}
      {bet.finish_game && (
        <div
          className={cn(
            'absolute left-0 top-0 bottom-0 w-1',
            bet.acertou ? 'bg-green-500' : 'bg-red-500'
          )}
        />
      )}

      <div className="p-4 pl-5">
        {/* Header com data e status */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <CalendarIcon className="size-3.5" />
              <span className="text-xs font-medium">
                {formatDateWithoutYear(bet.data_hora)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {bet.usou_carta_dobro_pontos && (
              <Tooltip>
                <TooltipTrigger>
                  <Badge
                    variant="outline"
                    className="bg-amber-500/10 text-amber-600 border-amber-500/30 gap-1"
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

            <Badge
              variant="outline"
              className={cn(
                'text-xs',
                bet.finish_game
                  ? 'bg-muted text-muted-foreground'
                  : 'bg-blue-500/10 text-blue-600 border-blue-500/30'
              )}
            >
              {bet.finish_game ? 'Encerrado' : 'Em Breve'}
            </Badge>
          </div>
        </div>

        {/* Placar / Times */}
        <div className="flex items-center justify-center gap-4 py-3">
          {/* Time A */}
          <div className="flex-1 flex flex-col items-center gap-1.5">
            <img
              src={
                flagCodeA
                  ? `/country-flags/${flagCodeA}.webp`
                  : imagesUrl.flagPlaceholder.url
              }
              alt={bet.team_a}
              className="aspect-video w-16 bg-muted-foreground/10 rounded-xs object-cover ring-1 ring-border shrink-0"
            />
            <span className="text-sm font-semibold text-center leading-tight">
              {bet.team_a}
            </span>
          </div>

          {/* Placar */}
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'size-10 flex items-center justify-center text-lg font-bold rounded-lg',
                bet.finish_game
                  ? 'bg-muted text-foreground'
                  : 'bg-secondary text-muted-foreground'
              )}
            >
              {bet.gols_a ?? '-'}
            </span>
            <span className="text-muted-foreground font-medium">x</span>
            <span
              className={cn(
                'size-10 flex items-center justify-center text-lg font-bold rounded-lg',
                bet.finish_game
                  ? 'bg-muted text-foreground'
                  : 'bg-secondary text-muted-foreground'
              )}
            >
              {bet.gols_b ?? '-'}
            </span>
          </div>

          {/* Time B */}
          <div className="flex-1 flex flex-col items-center gap-1.5">
            {bet.team_b_info?.flag_unicode && (
              <img
                src={
                  flagCodeB
                    ? `/country-flags/${flagCodeB}.webp`
                    : imagesUrl.flagPlaceholder.url
                }
                alt={bet.team_b}
                className="aspect-video w-16 bg-muted-foreground/10 rounded-xs object-cover ring-1 ring-border shrink-0"
              />
            )}
            <span className="text-sm font-semibold text-center leading-tight">
              {bet.team_b}
            </span>
          </div>
        </div>

        {/* Palpite e Resultado */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Seu palpite:</span>
            <Badge
              variant="outline"
              className={cn(
                'font-medium',
                bet.finish_game && bet.acertou
                  ? 'bg-green-500/10 text-green-600 border-green-500/30'
                  : bet.finish_game && !bet.acertou
                    ? 'bg-red-500/10 text-red-600 border-red-500/30'
                    : 'bg-primary/10 text-primary border-primary/30'
              )}
            >
              {getPalpiteText()}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {bet.finish_game ? (
              <div className="flex items-center gap-1.5">
                {bet.acertou ? (
                  <>
                    <CheckCircle2Icon className="size-4 text-green-500" />
                    <span className="text-sm font-semibold text-green-600">
                      +{bet.pontos} pts
                    </span>
                  </>
                ) : (
                  <>
                    <XCircleIcon className="size-4 text-red-500" />
                    <span className="text-sm font-medium text-red-600">
                      0 pts
                    </span>
                  </>
                )}
              </div>
            ) : (
              canEdit && (
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <CreateApostaDrawer bet={bet} mode="edit">
                        <Button variant="ghost" size="icon" className="size-8">
                          <PencilIcon className="size-4" />
                        </Button>
                      </CreateApostaDrawer>
                    }
                  />
                  <TooltipContent>
                    <p className="text-xs">Editar palpite</p>
                  </TooltipContent>
                </Tooltip>
              )
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
