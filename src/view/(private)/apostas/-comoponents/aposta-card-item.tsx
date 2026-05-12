import { PencilIcon } from 'lucide-react'
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
import { cn } from '@/lib/utils'
import type { IBet } from '@/services/bets/type'
import seloBetGreen from '/icons/bet-green.svg'
import seloBetRed from '/icons/bet-red.svg'
import { CreateApostaDrawer } from './create-aposta-drawer'

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
      <div className="relative flex justify-start items-center gap-6">
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
        {!bet.finish_game && bet.palpite !== null && (
          <Tooltip>
            <TooltipTrigger className={'ml-auto'}>
              <CreateApostaDrawer bet={bet}>
                <Button
                  variant={'outline'}
                  size={'icon'}
                  className={'cursor-pointer'}
                >
                  <PencilIcon strokeWidth={1.2} />
                </Button>
              </CreateApostaDrawer>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Clique para editar sua aposta</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      <div className="relative grid grid-cols-1">
        <div className="flex justify-start items-center gap-2">
          <div className="inline-flex font-semibold text-sm text-foreground">
            {bet.team_a}
          </div>
          <span className="size-7 flex justify-center items-center text-sm text-foreground bg-muted rounded">
            {bet.gols_a ?? '-'}
          </span>
          <div className="inline-flex text-sm text-foreground">x</div>
          <span className="size-7 flex justify-center items-center text-sm text-foreground bg-muted rounded">
            {bet.gols_b ?? '-'}
          </span>
          <div className="inline-flex font-semibold text-sm text-foreground">
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
      <footer className="flex justify-between items-center gap-6 text-muted-foreground">
        <p className="inline-flex items-center gap-1 text-xs">
          Palpite:
          {bet.palpite === 'A' && (
            <span className="font-semibold uppercase px-2 py-1 text-green-600 bg-green-400/10 rounded-full">
              {bet.team_a}
            </span>
          )}
          {bet.palpite === 'B' && (
            <span className="font-semibold uppercase px-2 py-1 text-green-600 bg-green-400/10 rounded-full">
              {bet.team_b}
            </span>
          )}
          {bet.palpite === 'EMPATE' && (
            <span className="font-semibold uppercase px-2 py-1 text-green-600 bg-green-400/10 rounded-full">
              Empate
            </span>
          )}
        </p>
        <span className="inline-flex text-xs">
          Atualizado em {formatDateWithoutYear(bet.updated_at)}
        </span>
      </footer>
    </Card>
  )
}
