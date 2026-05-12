import type { ComponentProps } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { formatDateWithoutYear } from '@/helpers/date'
import { cn } from '@/lib/utils'
import type { IBet } from '@/services/bets/type'
import seloBetGreen from '/icons/bet-green.svg'
import seloBetRed from '/icons/bet-red.svg'

type ApostaCardItemProps = ComponentProps<'div'> & {
  bet: IBet
}

export function ApostaCardItem({
  bet,
  className,
  ...props
}: ApostaCardItemProps) {
  return (
    <Card
      key={bet.id}
      className={cn('p-4 overflow-visible', className)}
      {...props}
    >
      {/* HEADER */}
      <div className="flex justify-start items-center gap-6">
        <Badge variant={'outline'}>
          {formatDateWithoutYear(bet.data_hora)}
        </Badge>
        <Badge
          variant={'outline'}
          className={
            bet.finish_game
              ? 'bg-red-400/15 text-red-600'
              : 'bg-blue-400/15 text-blue-600'
          }
        >
          <h3>{bet.finish_game ? 'Encerrado' : 'Em Breve'}</h3>
        </Badge>
      </div>

      <div className="relative grid grid-cols-1">
        <div className="grid grid-cols-5 gap-2">
          <div className="inline-flex text-base text-foreground">
            {bet.team_a}
          </div>
          <span className="inline-flex text-base text-foreground">
            {bet.gols_a}
          </span>
          <div className="inline-flex text-sm text-foreground">x</div>
          <span className="inline-flex text-base text-foreground">
            {bet.gols_b}
          </span>
          <div className="inline-flex text-base text-foreground">
            {bet.team_b}
          </div>
        </div>
        {bet.finish_game && (
          <img
            className="absolute -top-18 -right-8 z-40 size-20 -rotate-12 mix-blend-multiply drop-shadow-lg drop-shadow-foreground/30"
            src={bet.acertou ? seloBetGreen : seloBetRed}
            alt="Selo de aposta"
          />
        )}
      </div>

      {/* FOOTER */}
      <span className="inline-flex text-xs text-muted-foreground ml-auto">
        Última atualização {formatDateWithoutYear(bet.updated_at)}
      </span>
    </Card>
  )
}
