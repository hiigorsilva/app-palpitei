import type { ComponentProps } from 'react'
import { Card } from '@/components/ui/card'
import type { GamesByDate } from '..'

type Props = ComponentProps<'h2'> & {
  group: GamesByDate
}
export function GameItemCardTitle({ group }: Props) {
  return (
    <Card className="h-full w-full p-3 sm:min-w-44 sm:w-fit">
      <h2 className="font-normal text-sm text-muted-foreground text-start text-wrap">{`${group.date}`}</h2>
    </Card>
  )
}
