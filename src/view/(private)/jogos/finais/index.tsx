import { createFileRoute } from '@tanstack/react-router'
import { ArrowLeftIcon } from 'lucide-react'
import { TitleContainer } from '@/components/title-container'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getStorageAuth } from '@/helpers/auth'
import { getCountryCodeFromEmoji, imagesUrl } from '@/helpers/strings'
import {
  useListFase16AvosGames,
  useListFaseFinalGames,
  useListFaseOitavasGames,
  useListFaseQuartasGames,
  useListFaseSemiGames,
  useListFaseTerceiroGames,
} from '@/services/games/query'
import type { IGame } from '@/services/games/type'
import { GridFaseCard } from '../-components/grid-fase-card'

export const Route = createFileRoute('/(private)/jogos/finais/')({
  component: TournamentFinalGames,
  head: () => ({
    meta: [
      {
        title: 'Jogos Mata-Mata | Palpitei',
      },
    ],
  }),
})

function TournamentFinalGames() {
  const navigate = Route.useNavigate()
  const userId = getStorageAuth()?.id

  const { data: games16Avos } = useListFase16AvosGames(userId)
  const { data: gamesOitavas } = useListFaseOitavasGames(userId)
  const { data: gamesQuartas } = useListFaseQuartasGames(userId)
  const { data: gamesSemi } = useListFaseSemiGames(userId)
  const { data: gamesTerceiro } = useListFaseTerceiroGames(userId)
  const { data: gamesFinal } = useListFaseFinalGames(userId)

  const games = {
    fase_16avos: games16Avos ?? [],
    fase_oitavas: gamesOitavas ?? [],
    fase_quartas: gamesQuartas ?? [],
    fase_semi: gamesSemi ?? [],
    fase_terceiro: gamesTerceiro ?? [],
    fase_final: gamesFinal ?? [],
  }

  const fases = [
    {
      fase: '16_AVOS' as const,
      games: games.fase_16avos,
      isVisible: Boolean(games16Avos),
    },
    {
      fase: 'OITAVAS' as const,
      games: games.fase_oitavas,
      isVisible: Boolean(gamesOitavas),
    },
    {
      fase: 'QUARTAS' as const,
      games: games.fase_quartas,
      isVisible: Boolean(gamesQuartas),
    },
    {
      fase: 'SEMI' as const,
      games: games.fase_semi,
      isVisible: Boolean(gamesSemi),
    },
    {
      fase: 'FINAL' as const,
      games: games.fase_final,
      complementaryGames: games.fase_terceiro,
      isVisible: Boolean(gamesFinal),
    },
  ]

  const bracketRows = Math.max(
    ...fases.map((fase, index) => fase.games.length * 2 ** index),
    1
  )

  function handleBackNavigate() {
    navigate({ to: '../..' })
  }

  return (
    <section className="flex flex-col gap-6">
      <TitleContainer>
        <Button
          size={'icon'}
          variant={'ghost'}
          className={'cursor-pointer'}
          onClick={handleBackNavigate}
        >
          <ArrowLeftIcon />
        </Button>
        Confrontos de Mata-Mata
      </TitleContainer>
      <Card className="min-h-dvh h-fit w-full p-6 bg-transparent overflow-x-auto">
        <div className="flex min-w-max items-start justify-start gap-8 p-1">
          {fases.map((fase, index) => (
            <GridFaseCard
              key={fase.fase}
              fase={fase.fase}
              games={fase.games}
              complementaryGames={fase.complementaryGames}
              bracketRows={bracketRows}
              roundIndex={index}
              isVisible={fase.isVisible}
              hasNextFase={index < fases.length - 1}
            />
          ))}
        </div>
      </Card>
    </section>
  )
}

type Props = {
  game: IGame
  team: 'a' | 'b'
}
export function TeamDisplayRow({ game, team }: Props) {
  const teamInfo = team === 'a' ? game.team_a_info : game.team_b_info
  const flagCode = teamInfo?.flag_icon
    ? getCountryCodeFromEmoji(teamInfo.flag_icon)
    : null
  const teamName = team === 'a' ? game.team_a : game.team_b

  return (
    <div className="flex flex-col gap-1">
      <div className="w-full flex justify-between items-center gap-1">
        <div className="aspect-video w-14 relative rounded border bg-muted-foreground/10 overflow-hidden">
          <img
            className="absolute object-cover w-full h-full"
            src={
              flagCode
                ? `/country-flags/${flagCode}.webp`
                : imagesUrl.flagPlaceholder.url
            }
            alt={teamName}
          />
        </div>
        <p className="min-w-0 w-full truncate text-sm text-foreground">
          {teamName}
        </p>
        <div className="w-14 flex justify-center items-center text-sm text-foreground rounded border bg-muted-foreground/10">
          {team === 'a' ? (game.gols_a ?? '-') : (game.gols_b ?? '-')}
        </div>
      </div>
    </div>
  )
}
