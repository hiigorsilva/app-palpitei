import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

export function IconApostaTooltip() {
  return (
    <Tooltip>
      <TooltipTrigger className="absolute top-0 right-0 text-xs text-primary px-2 py-1 rounded-bl-md bg-primary/15">
        Apostado
      </TooltipTrigger>
      <TooltipContent>
        <p className="xs">Esse jogo possui uma aposta ativa.</p>
      </TooltipContent>
    </Tooltip>
  )
}
