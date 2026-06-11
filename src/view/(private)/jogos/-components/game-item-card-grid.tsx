import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

type Props = ComponentProps<'ul'> & {}
export function GameItemCardGrid({ children, className, ...props }: Props) {
  return (
    <ul
      className={cn(
        'grid grid-cols-1 gap-3 sm:flex sm:flex-wrap sm:justify-start sm:items-center',
        className
      )}
      {...props}
    >
      {children}
    </ul>
  )
}
