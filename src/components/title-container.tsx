import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

type TitleContainerProps = ComponentProps<'h2'> & {}

export function TitleContainer({ children, ...props }: TitleContainerProps) {
  return (
    <h2 className={cn('font-semibold text-base text-foreground')} {...props}>
      {children}
    </h2>
  )
}
