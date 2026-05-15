import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { formatDateWithoutYear } from '@/helpers/date'
import { getFaseName } from '@/helpers/games'
import type { IGame } from '@/services/games/type'
import { CreateApostaDrawer } from '@/view/(private)/apostas/-comoponents/create-aposta-drawer'
import { TeamInfoItem } from './team-info-item'

type DisplayGameProps = {
  game: IGame
}
export function DisplayGame({ game }: DisplayGameProps) {
  return (
    <Card className="relative flex flex-col justify-center items-center gap-3 overflow-hidden">
      <div className="absolute inset-0 z-10 bg-background/75" />
      <img
        className="w-full h-full absolute top-1/2 -translate-y-1/2 right-0 z-0 object-cover"
        src="https://fistf.com/wp-content/uploads/2017/08/cropped-UEFA-Champions-League-Stadium-Wallpaper.jpg"
        alt=""
      />

      <div className="relative z-20 flex flex-col justify-center items-center gap-3">
        <span className="inline-flex text-sm text-foreground tracking-tight">
          Copa do Mundo FIFA 2026 - {getFaseName(game.fase)}
        </span>
        <Badge
          variant={'secondary'}
          className="text-sm capitalize bg-foreground/10 text-foreground"
        >
          {formatDateWithoutYear(game.data_hora, 'long')}
        </Badge>
        <ul className="grid grid-cols-3 gap-3 place-content-end">
          <TeamInfoItem game={game} team="a" />
          <div className="w-full flex flex-col justify-center items-center gap-2">
            <div className="w-full font-semibold text-4xl leading-none text-center">
              {game.gols_a ?? '4'} x {game.gols_b ?? '2'}
            </div>
            <span className="inline-flex font-normal text-sm text-foreground/75 tracking-tight capitalize">
              {game.finish_game ? 'Encerrado' : 'Em breve'}
            </span>
          </div>
          <TeamInfoItem game={game} team="b" />
        </ul>

        <CreateApostaDrawer bet={game}>
          <Button>Fazer aposta</Button>
        </CreateApostaDrawer>
      </div>
    </Card>
  )
}
