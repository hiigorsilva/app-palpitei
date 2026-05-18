import type { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { formatDateWithoutYear } from '@/helpers/date'
import { getFaseName } from '@/helpers/games'
import { getCountryCodeFromEmoji } from '@/helpers/strings'
import type { IGame } from '@/services/games/type'
import { CreateApostaDrawer } from '@/view/(private)/apostas/-comoponents/create-aposta-drawer'
import { Button } from './ui/button'

// Root: O container do card
const MatchRoot = ({ children }: { children: ReactNode }) => (
  <Card className="flex flex-col gap-3 overflow-hidden p-6 hover:shadow-md transition-shadow bg-card">
    {children}
  </Card>
)

// Header: Fase e Status (Badge)
interface MatchHeaderProps {
  match: IGame
}
const MatchHeader = ({ match }: MatchHeaderProps) => (
  <div className="grid grid-cols-3 items-center">
    <span className="flex justify-start items-center text-sm font-normal capitalize text-muted-foreground">
      {getFaseName(match.fase)}
    </span>

    <Badge
      className={`${match.has_palpite ? 'bg-primary/10 text-primary' : 'bg-foreground/10 text-muted-foreground'} mx-auto`}
    >
      {match.has_palpite ? 'Possui aposta' : 'Nenhuma aposta'}
    </Badge>

    <div className="flex justify-end items-center text-xs text-muted-foreground">
      {formatDateWithoutYear(match.data_hora, 'short')}
    </div>
  </div>
)

// Content: Times e Placar
interface MatchScoreProps {
  match: IGame
}
const MatchScore = ({ match }: MatchScoreProps) => {
  const flagTeamA = `/country-flags/${getCountryCodeFromEmoji(match.team_a_info?.flag_icon || '').toLowerCase()}.webp`
  const flagTeamB = `/country-flags/${getCountryCodeFromEmoji(match.team_b_info?.flag_icon || '').toLowerCase()}.webp`

  return (
    <div className="grid grid-cols-7 place-content-center">
      <div className="col-span-3 grid grid-cols-2 items-center justify-center gap-3">
        <img
          className="relative aspect-video w-20 h-full rounded object-cover"
          src={flagTeamA}
          alt={`Bandeira ${match.team_a}`}
        />
        <span className="font-medium text-sm text-start">{match.team_a}</span>
      </div>
      <span className="col-span-1 w-full inline-flex justify-center items-center text-center">
        X
      </span>
      <div className="col-span-3 grid grid-cols-2 items-center justify-center gap-3">
        <span className="font-medium text-sm text-end">{match.team_b}</span>
        <img
          className="relative aspect-video w-20 h-full rounded object-cover ml-auto"
          src={flagTeamB}
          alt={`Bandeira ${match.team_b}`}
        />
      </div>
    </div>
  )
}

// Footer: Data e Hora
const MatchFooter = ({ match }: { match: IGame }) => (
  <footer className="flex justify-center items-center gap-3">
    <CreateApostaDrawer
      bet={match}
      mode={match.has_palpite ? 'edit' : 'create'}
    >
      <Button className={'w-fit'} variant={'outline'}>
        {match.has_palpite ? 'Editar aposta' : 'Fazer aposta'}
      </Button>
    </CreateApostaDrawer>
  </footer>
)

export const Match = {
  Root: MatchRoot,
  Header: MatchHeader,
  Score: MatchScore,
  Footer: MatchFooter,
}
