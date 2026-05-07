import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

type Props = ComponentProps<'div'> & {}
export function GameItemGridGroupDate({
  children,
  className,
  ...props
}: Props) {
  return (
    <div className={cn('grid grid-cols-1 gap-8 p-6', className)} {...props}>
      {children}
    </div>
  )
}
