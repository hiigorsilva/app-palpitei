import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

type Props = ComponentProps<'ul'> & {}
export function GameItemCardGrid({ children, className, ...props }: Props) {
  return (
    <ul
      className={cn(
        'grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3',
        className
      )}
      {...props}
    >
      {children}
    </ul>
  )
}
