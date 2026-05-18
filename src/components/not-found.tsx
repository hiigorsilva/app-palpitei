import { useNavigate } from '@tanstack/react-router'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'

type NotFoundProps = ComponentProps<'div'>

export function NotFound({ className, ...props }: NotFoundProps) {
  const navigate = useNavigate()

  function handleGoToHome() {
    navigate({ to: '/' })
  }

  return (
    <div
      className={cn(
        'absolute inset-0 z-50 w-full h-full flex justify-center items-center bg-background',
        className
      )}
      {...props}
    >
      <h2 className="font-semibold text-2xl text-foreground tracking-tight">
        Página não encontrada
      </h2>
      <Button variant={'secondary'} onClick={handleGoToHome}>
        Ir para a página inicial
      </Button>
    </div>
  )
}
