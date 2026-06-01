import { DollarSignIcon, SparklesIcon } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

type IconApostaTooltipProps = {
  usouCartaDobroPontos?: boolean
}

export function IconApostaTooltip({
  usouCartaDobroPontos = false,
}: IconApostaTooltipProps) {
  const Icon = usouCartaDobroPontos ? SparklesIcon : DollarSignIcon

  return (
    <Tooltip>
      <TooltipTrigger className="absolute top-0 right-0 text-xs text-primary px-2 py-0.5 rounded-bl-md bg-primary/15">
        <Icon strokeWidth={1.3} className="size-4" />
      </TooltipTrigger>
      <TooltipContent>
        <p className="xs">
          {usouCartaDobroPontos
            ? 'Esse jogo possui uma aposta com carta dobro de pontos.'
            : 'Esse jogo possui uma aposta ativa.'}
        </p>
      </TooltipContent>
    </Tooltip>
  )
}
