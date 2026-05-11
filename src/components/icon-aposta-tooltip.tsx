import { CircleDollarSignIcon } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

export function IconApostaTooltip() {
  return (
    <Tooltip>
      <TooltipTrigger>
        <div className="absolute top-0 right-0 p-1 rounded-bl-md bg-green-400/15">
          <CircleDollarSignIcon
            strokeWidth={1.2}
            className="size-4 text-green-600"
          />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p className="xs">Esse jogo possui uma aposta ativa.</p>
      </TooltipContent>
    </Tooltip>
  )
}
