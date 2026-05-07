import type { ComponentProps } from 'react'
import { Separator } from '@/components/ui/separator'
import type { GamesByDate } from '..'

type Props = ComponentProps<'h2'> & {
  group: GamesByDate
}
export function GameItemCardTitle({ group }: Props) {
  return (
    <>
      <h2 className="font-semibold text-md text-start">{`Dia ${group.date}`}</h2>
      <Separator />
    </>
  )
}
