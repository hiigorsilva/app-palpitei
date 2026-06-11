import { CalendarDaysIcon, ClockIcon, TrophyIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getStorageAuth } from '@/helpers/auth'
import { formatDateWithoutYear } from '@/helpers/date'
import { getFaseName } from '@/helpers/games'
import { imagesUrl } from '@/helpers/strings'
import { useGetBetsByUserId } from '@/services/bets/query'
import type { IGame } from '@/services/games/type'
import { CreateApostaDrawer } from '@/view/(private)/apostas/-comoponents/create-aposta-drawer'
import { TeamInfoItem } from './team-info-item'

type DisplayGameProps = {
  game: IGame
}
export function DisplayGame({ game }: DisplayGameProps) {
  const userId = getStorageAuth()?.id
  const { data: bets, isLoading: isLoadingBets } = useGetBetsByUserId(userId!)

  const gameBet = bets?.find(bet => bet.gameId === game.id) ?? null
  const hasBet = Boolean(gameBet)
  const statusLabel = game.finish_game ? 'Encerrado' : 'Em breve'
  const scoreA = game.gols_a ?? ''
  const scoreB = game.gols_b ?? ''
  const faseName = getFaseName(game.fase)

  function getBetLabel() {
    if (gameBet?.palpite === 'A') return `Apostou na vitória de ${game.team_a}`
    if (gameBet?.palpite === 'B') return `Apostou na vitória de ${game.team_b}`
    if (gameBet?.palpite === 'EMPATE') return 'Apostou no empate'
    return null
  }

  function getStatusGameColor(finishGame: boolean) {
    if (finishGame) {
      return 'bg-red-400/15 text-red-400 border border-red-400/20'
    }
    if (!finishGame) {
      return 'bg-primary/15 text-primary border border-primary/20'
    }
    return ''
  }

  const betLabel = getBetLabel()
  const isBetDisabled = (data_hora: string, finish_game: boolean) => {
    const gameTime = new Date(data_hora).getTime()
    const currentTime = Date.now()
    const fifteenMinutesInMs = 15 * 60 * 1000

    return finish_game || currentTime >= gameTime - fifteenMinutesInMs
  }

  return (
    <Card className="relative min-h-105 justify-between gap-0 overflow-hidden p-0">
      <div className="absolute inset-0 z-10 bg-background/90 backdrop-blur-[1px] dark:bg-background/82" />
      <div className="absolute inset-0 z-10 bg-background/50" />
      <img
        className="w-full h-full absolute top-1/2 -translate-y-1/2 right-0 z-0 object-cover"
        src={imagesUrl.bannerDetailsGame.url}
        alt={imagesUrl.bannerDetailsGame.alt_text}
      />

      <div className="relative z-20 flex min-h-105 flex-col">
        <div className="flex flex-col gap-3 border-b border-border/60 bg-card/55 px-4 py-4 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-normal text-muted-foreground">
              <TrophyIcon className="size-3.5" />
              <span>Copa do Mundo FIFA 2026</span>
            </div>
            <h2 className="truncate text-lg font-semibold leading-tight text-foreground sm:text-xl">
              {faseName}
            </h2>
          </div>

          <div className="flex flex-wrap justify-between items-center gap-2">
            <Badge
              variant="secondary"
              className="h-7 gap-1.5 rounded-md bg-background/80 px-2.5 text-xs text-foreground ring-1 ring-border"
            >
              <CalendarDaysIcon className="size-3.5" />
              <span className="capitalize">
                {formatDateWithoutYear(game.data_hora, 'long')}
              </span>
            </Badge>
            <Badge
              className={`h-7 gap-1.5 ${getStatusGameColor(game.finish_game)} rounded-md px-2.5 text-xs`}
            >
              <ClockIcon className="size-3.5" />
              {statusLabel}
            </Badge>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-center gap-6 px-3 py-6 sm:px-6 sm:py-8 lg:px-10">
          <ul className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-2 sm:gap-6">
            <TeamInfoItem game={game} team="a" className="justify-self-end" />
            <li className="flex min-w-18 flex-col items-center justify-center gap-1.5 rounded-lg border border-border/70 bg-card/75 px-2 py-3 shadow-sm backdrop-blur-sm sm:min-w-28 sm:gap-2 sm:px-4 sm:py-4 lg:min-w-32 lg:px-5">
              <div className="flex items-center gap-1.5 text-2xl font-bold leading-none text-foreground sm:gap-2 sm:text-4xl lg:text-5xl">
                <span className="text-3xl sm:text-4xl lg:text-5xl">
                  {scoreA}
                </span>
                <span className="text-lg font-normal text-muted-foreground sm:text-2xl lg:text-3xl">
                  x
                </span>
                <span className="text-3xl sm:text-4xl lg:text-5xl">
                  {scoreB}
                </span>
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                Placar
              </span>
            </li>
            <TeamInfoItem game={game} team="b" className="justify-self-start" />
          </ul>

          <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-3">
            {betLabel && (
              <Badge className="h-auto min-h-7 max-w-full rounded-md border border-primary/20 bg-primary/15 px-3 py-1 text-center text-primary">
                {betLabel}
              </Badge>
            )}

            <div className="flex w-full flex-col items-center gap-2">
              <CreateApostaDrawer
                bet={gameBet ?? game}
                mode={hasBet ? 'edit' : 'create'}
              >
                <Button
                  className="h-10 w-full text-sm sm:h-11 sm:w-auto sm:text-base"
                  disabled={
                    isBetDisabled(game.data_hora, game.finish_game) ||
                    isLoadingBets
                  }
                >
                  {hasBet ? 'Editar aposta' : 'Fazer aposta'}
                </Button>
              </CreateApostaDrawer>

              {/* Encerrar apostas quando o jogo terminar ou quando já tiver faltando 15 minutos para o horário do jogo (dentro da data) */}
              {isBetDisabled(game.data_hora, game.finish_game) && (
                <span className="block text-center text-xs text-muted-foreground">
                  Apostas encerradas para esta partida.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
