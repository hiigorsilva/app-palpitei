import { createFileRoute } from '@tanstack/react-router'
import {
  ArrowLeftIcon,
  SparklesIcon,
  TargetIcon,
  TrophyIcon,
} from 'lucide-react'
import { useState } from 'react'
import { Loading } from '@/components/loading'
import { TitleContainer } from '@/components/title-container'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { UserDetailsCard } from '@/components/user-card-item'
import { cn } from '@/lib/utils'
import { useRanking } from '@/services/ranking/query'
import { useListUsers } from '@/services/users/query'
import type { IUser } from '@/services/users/type'

export const Route = createFileRoute('/(private)/participantes/')({
  component: ParticipantesPage,
  head: () => ({
    meta: [
      {
        title: 'Participantes | Palpitei',
      },
    ],
  }),
})

function getPositionStyles(position: number) {
  switch (position) {
    case 1:
      return {
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        text: 'text-amber-500',
        icon: 'text-amber-500',
        glow: 'shadow-amber-500/20',
      }
    case 2:
      return {
        bg: 'bg-slate-400/10',
        border: 'border-slate-400/30',
        text: 'text-slate-400',
        icon: 'text-slate-400',
        glow: 'shadow-slate-400/20',
      }
    case 3:
      return {
        bg: 'bg-orange-600/10',
        border: 'border-orange-600/30',
        text: 'text-orange-600',
        icon: 'text-orange-600',
        glow: 'shadow-orange-600/20',
      }
    default:
      return {
        bg: 'bg-muted/50',
        border: 'border-border',
        text: 'text-muted-foreground',
        icon: 'text-muted-foreground',
        glow: '',
      }
  }
}

function getLevelColor(nivel: string) {
  const lowerNivel = nivel.toLowerCase()
  if (lowerNivel.includes('lendário') || lowerNivel.includes('mestre')) {
    return 'bg-amber-500/20 text-amber-500 border-amber-500/30'
  }
  if (lowerNivel.includes('expert') || lowerNivel.includes('ouro')) {
    return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30'
  }
  if (lowerNivel.includes('avançado') || lowerNivel.includes('prata')) {
    return 'bg-slate-400/20 text-slate-500 border-slate-400/30'
  }
  if (lowerNivel.includes('intermediário') || lowerNivel.includes('bronze')) {
    return 'bg-orange-500/20 text-orange-600 border-orange-500/30'
  }
  return 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30'
}

function ParticipantesPage() {
  const navigate = Route.useNavigate()
  const participantes = useListUsers()
  const ranking = useRanking()

  const [openUserCard, setOpenUserCard] = useState(false)
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null)
  const [selectedUserPosition, setSelectedUserPosition] = useState(1)

  const getProgressToNextLevel = (participant: IUser) => {
    if (!participant.proximo_nivel) return 100
    if (participant.proximo_nivel.minimoPercentual <= 0) return 0

    return Math.min(
      100,
      (participant.percentual / participant.proximo_nivel.minimoPercentual) *
        100
    )
  }

  function handleBackNavigate() {
    navigate({ to: '..' })
  }

  function handleOpenUserCard(participant: IUser, position: number) {
    setSelectedUser(participant)
    setSelectedUserPosition(position)
    setOpenUserCard(true)
  }

  if (!participantes.data) return <Loading />
  if (!ranking.data) return <Loading />

  const rankingByUserId = new Map(
    ranking.data.map(item => [item.userId, item] as const)
  )

  const orderedParticipants = participantes.data.slice().sort((a, b) => {
    const rankingA = rankingByUserId.get(a.id)
    const rankingB = rankingByUserId.get(b.id)

    if (rankingA && rankingB) return rankingA.position - rankingB.position
    if (rankingA) return -1
    if (rankingB) return 1

    return a.name.localeCompare(b.name, 'pt-BR')
  })

  return (
    <section className="flex flex-col gap-6">
      <TitleContainer>
        <Button
          size={'icon'}
          variant={'ghost'}
          className={'cursor-pointer'}
          onClick={handleBackNavigate}
        >
          <ArrowLeftIcon />
        </Button>
        Participantes
      </TitleContainer>

      <p className="text-muted-foreground">
        Veja todos os participantes do bolão da Copa do Mundo 2026.
      </p>

      <div className="flex flex-col gap-3">
        {orderedParticipants.map((participant, index) => {
          const participantRanking = rankingByUserId.get(participant.id)
          const position = participantRanking?.position ?? index + 1
          const positionStyles = getPositionStyles(position)
          const levelColor = getLevelColor(participant.nivel_atual)
          const progressToNextLevel = getProgressToNextLevel(participant)

          return (
            <Card
              key={participant.id}
              onClick={() => handleOpenUserCard(participant, position)}
              className={cn(
                'group relative cursor-pointer overflow-hidden border p-4 transition-all duration-300',
                'hover:scale-[1.01] hover:shadow-lg',
                positionStyles.border,
                positionStyles.glow && positionStyles.glow
              )}
            >
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    'flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl border',
                    positionStyles.bg,
                    positionStyles.border
                  )}
                >
                  {position <= 3 && (
                    <TrophyIcon
                      className={cn('h-5 w-5', positionStyles.icon)}
                    />
                  )}
                  <span
                    className={cn(
                      'inline-flex -mr-2 text-xl font-bold',
                      positionStyles.text
                    )}
                  >
                    {position}º
                  </span>
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="truncate text-lg font-semibold text-foreground">
                      {participant.name}
                    </h3>
                    <Badge
                      variant="outline"
                      className={cn('shrink-0 border', levelColor)}
                    >
                      {participant.nivel_atual}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <TrophyIcon className="h-4 w-4" />
                      <span className="font-medium">
                        {participantRanking?.pontos_total ?? 0} pts
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <TargetIcon className="h-4 w-4" />
                      <span className="font-medium">
                        {participant.percentual.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <SparklesIcon className="h-4 w-4" />
                      <span>{participant.jogos_apostados} jogos</span>
                    </div>
                  </div>

                  {participant.proximo_nivel && (
                    <div className="mt-1">
                      <div className="mb-1 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                        <span className="truncate">
                          Próximo nível: {participant.proximo_nivel.nivel}
                        </span>
                        <span className="shrink-0">
                          {progressToNextLevel.toFixed(0)}%
                        </span>
                      </div>
                      <Progress value={progressToNextLevel} className="h-1.5" />
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {selectedUser && (
        <UserDetailsCard
          onOpenChange={setOpenUserCard}
          open={openUserCard}
          position={selectedUserPosition}
          user={selectedUser}
        />
      )}
    </section>
  )
}
