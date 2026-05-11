import type { ComponentProps } from 'react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { GamesByDate } from '..'

type Props = ComponentProps<'div'> & {
  group: GamesByDate
}
export function GameItemGridGroupDateItem({
  children,
  className,
  group,
  ...props
}: Props) {
  return (
    <Card
      key={group.date}
      className={cn(
        'w-full flex flex-row justify-start items-center gap-2 p-1 ring-0 shadow-none bg-transparent',
        className
      )}
      {...props}
    >
      {children}
    </Card>
  )
}
