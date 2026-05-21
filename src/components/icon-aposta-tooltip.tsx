import { DollarSignIcon } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

export function IconApostaTooltip() {
  return (
    <Tooltip>
      <TooltipTrigger className="absolute top-0 right-0 text-xs text-primary px-2 py-0.5 rounded-bl-md bg-primary/15">
        <DollarSignIcon strokeWidth={1.3} className="size-4" />
      </TooltipTrigger>
      <TooltipContent>
        <p className="xs">Esse jogo possui uma aposta ativa.</p>
      </TooltipContent>
    </Tooltip>
  )
}
