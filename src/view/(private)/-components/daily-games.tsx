import { useMemo } from 'react'
import { Match } from '@/components/games-day'
import { TitleContainer } from '@/components/title-container'
import type { IGame } from '@/services/games/type'

export function DailyMatchesSummary({ matches }: { matches: IGame[] }) {
  const sortedMatches = useMemo(() => {
    return [...matches].sort(
      (a, b) =>
        new Date(a.data_hora).getTime() - new Date(b.data_hora).getTime()
    )
  }, [matches])

  return (
    <section className="space-y-4">
      <TitleContainer>Jogos do Dia</TitleContainer>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedMatches.map(match => (
          <Match.Root key={match.id}>
            <Match.Header fase={match.fase} isFinished={match.finish_game} />
            <Match.Score
              teamA={match.team_a}
              teamB={match.team_b}
              golsA={match.gols_a}
              golsB={match.gols_b}
            />
            <Match.Footer date={match.data_hora} />
          </Match.Root>
        ))}
      </div>
    </section>
  )
}
