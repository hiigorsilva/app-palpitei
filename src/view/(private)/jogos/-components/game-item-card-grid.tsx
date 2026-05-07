import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

type Props = ComponentProps<'ul'> & {}
export function GameItemCardGrid({ children, className, ...props }: Props) {
  return (
    <ul
      className={cn('grid grid-cols-3 gap-3 place-content-center', className)}
      {...props}
    >
      {children}
    </ul>
  )
}
