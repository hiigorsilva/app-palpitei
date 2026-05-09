import type { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatDateWithoutYear } from '@/helpers/date'

// Root: O container do card
const MatchRoot = ({ children }: { children: ReactNode }) => (
  <Card className="overflow-hidden hover:shadow-md transition-shadow bg-card">
    <CardContent className="p-4 flex flex-col gap-3">{children}</CardContent>
  </Card>
)

// Header: Fase e Status (Badge)
interface MatchHeaderProps {
  fase: string
  isFinished: boolean
}
const MatchHeader = ({ fase, isFinished }: MatchHeaderProps) => (
  <div className="flex justify-between items-center border-b pb-2">
    <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
      {fase}
    </span>
    <Badge variant={isFinished ? 'secondary' : 'default'} className="text-xs">
      {isFinished ? 'Encerrado' : 'Em breve'}
    </Badge>
  </div>
)

// Content: Times e Placar
interface MatchScoreProps {
  teamA: string
  teamB: string
  golsA: number | null
  golsB: number | null
}
const MatchScore = ({ teamA, teamB, golsA, golsB }: MatchScoreProps) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex flex-col gap-2 flex-1">
      <div className="flex justify-between items-center">
        <span className="font-medium text-sm">{teamA}</span>
        <span className="font-bold text-lg">{golsA ?? '-'}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-medium text-sm">{teamB}</span>
        <span className="font-bold text-lg">{golsB ?? '-'}</span>
      </div>
    </div>
  </div>
)

// Footer: Data e Hora
const MatchFooter = ({ date }: { date: string }) => (
  <div className="text-xs text-muted-foreground flex justify-end">
    {formatDateWithoutYear(date)}
  </div>
)

export const Match = {
  Root: MatchRoot,
  Header: MatchHeader,
  Score: MatchScore,
  Footer: MatchFooter,
}
