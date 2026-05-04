import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

type ContainerProps = ComponentProps<'div'>

export const Container = ({ children, ...props }: ContainerProps) => {
  return (
    <div
      className={cn(
        'flex flex-col flex-auto max-w-7xl w-full mx-auto bg-blue-400',
        props.className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
