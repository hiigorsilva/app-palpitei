import { useMemo } from 'react'
import { Match } from '@/components/games-day'
import { Card } from '@/components/ui/card'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { Separator } from '@/components/ui/separator'
import type { IGame } from '@/services/games/type'

export function DailyMatchesSummary({ matches }: { matches: IGame[] }) {
  const sortedMatches = useMemo(() => {
    return [...matches].sort(
      (a, b) =>
        new Date(a.data_hora).getTime() - new Date(b.data_hora).getTime()
    )
  }, [matches])

  return (
    <Card className="w-full h-full grid grid-cols-1 gap-3 bg-transparent p-3">
      {sortedMatches.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle className="text-sm text-muted-foreground">
              Nenhum jogo hoje
            </EmptyTitle>
            <EmptyDescription>
              Não há jogos programados para este dia.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        sortedMatches.map(match => (
          <Match.Root key={match.id}>
            <Match.Header match={match} />
            <Separator />
            <Match.Score match={match} />
            <Match.Footer match={match} />
          </Match.Root>
        ))
      )}
    </Card>
  )
}
