import dayjs from 'dayjs'
import { type ComponentProps, useEffect, useMemo, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DateNow } from '@/helpers/date'
import { cn } from '@/lib/utils'

type CountdownToStartProps = ComponentProps<'div'> & {}

export function CountdownToStart({
  className,
  ...props
}: CountdownToStartProps) {
  const [open, setOpen] = useState(true)
  const [now, setNow] = useState(() => DateNow())

  const firstGameDate = '2026-06-09T16:00:00-03:00'
  const isCountdownFinished = dayjs(firstGameDate).diff(dayjs(now)) <= 0

  if (isCountdownFinished) return null

  const remaining = useMemo(() => {
    if (!firstGameDate) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalMs: 0,
      }
    }

    const diff = Math.max(dayjs(firstGameDate).diff(dayjs(now)), 0)
    const totalSeconds = Math.floor(diff / 1000)

    return {
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
      totalMs: diff,
    }
  }, [now])

  const blocks = [
    { label: 'Dias', value: remaining.days },
    { label: 'Horas', value: remaining.hours },
    { label: 'Minutos', value: remaining.minutes },
    { label: 'Segundos', value: remaining.seconds },
  ]

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(DateNow())
    }, 1000)
    return () => window.clearInterval(interval)
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={cn(
          'overflow-hidden border-border/60 p-0 sm:max-w-2xl',
          className
        )}
        {...props}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.18),transparent_34%),linear-gradient(135deg,hsl(var(--muted)/0.7),transparent_45%)]" />
          <div className="relative space-y-6 p-6 sm:p-8">
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-xl sm:text-2xl">
                Contagem Regressiva
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Falta pouco para o primeiro jogo. O cronômetro zera no horário
                de Brasília.
              </p>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {blocks.map(block => (
                <div
                  key={block.label}
                  className="rounded-2xl border border-border/70 bg-background/80 px-4 py-5 text-center shadow-sm backdrop-blur"
                >
                  <div className="text-3xl font-semibold tracking-tight tabular-nums text-foreground sm:text-4xl">
                    {String(block.value).padStart(2, '0')}
                  </div>
                  <div className="mt-1 text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
                    {block.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <span>
                A estreia da Copa do Mundo está marcada para o dia 09 de Junho
                às 16h.
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
