import { Loader2Icon } from 'lucide-react'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

type LoadingProps = ComponentProps<'div'>

export function Loading({ className, ...props }: LoadingProps) {
  return (
    <div
      className={cn(
        'absolute inset-0 z-50 w-full h-full flex justify-center items-center bg-background',
        className
      )}
      {...props}
    >
      <Loader2Icon className="animate-spin" />
    </div>
  )
}
