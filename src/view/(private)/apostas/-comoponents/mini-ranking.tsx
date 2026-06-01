import { Medal, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { IRankingItem } from '@/services/ranking/type'

interface MiniRankingProps {
  ranking: IRankingItem[]
  currentUserId: string
}

export function MiniRanking({ ranking, currentUserId }: MiniRankingProps) {
  const sortedRanking = ranking.slice().sort((a, b) => a.position - b.position)

  const top3 = sortedRanking.slice(0, 3)
  const currentUser = sortedRanking.find(item => item.userId === currentUserId)
  const currentUserInTop3 = top3.some(item => item.userId === currentUserId)

  const getPositionStyle = (posicao: number) => {
    switch (posicao) {
      case 1:
        return 'bg-amber-500/10 text-amber-600 border-amber-500/30'
      case 2:
        return 'bg-slate-400/10 text-slate-500 border-slate-400/30'
      case 3:
        return 'bg-orange-600/10 text-orange-700 border-orange-600/30'
      default:
        return 'bg-muted text-muted-foreground border-border'
    }
  }

  const getPositionIcon = (posicao: number) => {
    if (posicao === 1) {
      return <Trophy className="size-3.5" />
    }
    if (posicao <= 3) {
      return <Medal className="size-3.5" />
    }
    return <span className="text-xs font-semibold">{posicao}</span>
  }

  return (
    <div className="w-full bg-card border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="size-4 text-amber-500" />
        <h3 className="font-semibold text-sm text-foreground">Ranking</h3>
      </div>

      <div className="flex flex-col gap-2">
        {top3.map(user => (
          <div
            key={user.userId}
            className={cn(
              'flex items-center gap-3 p-2.5 rounded-lg transition-colors',
              user.userId === currentUserId
                ? 'bg-primary/5 border border-primary/20'
                : 'hover:bg-muted/50'
            )}
          >
            <div
              className={cn(
                'flex items-center justify-center size-7 rounded-full border',
                getPositionStyle(user.position)
              )}
            >
              {getPositionIcon(user.position)}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={cn(
                  'text-sm font-medium truncate',
                  user.userId === currentUserId
                    ? 'text-primary'
                    : 'text-foreground'
                )}
              >
                {user.name}
                {user.userId === currentUserId && (
                  <span className="text-xs text-muted-foreground ml-1">
                    (você)
                  </span>
                )}
              </p>
            </div>
            <span className="text-sm font-semibold text-foreground">
              {user.pontos_total}
              <span className="text-xs text-muted-foreground ml-0.5">pts</span>
            </span>
          </div>
        ))}

        {/* Mostrar usuário atual se não estiver no top 3 */}
        {currentUser && !currentUserInTop3 && (
          <>
            <div className="flex items-center gap-2 py-1">
              <div className="flex-1 border-t border-dashed border-border" />
              <span className="text-xs text-muted-foreground">...</span>
              <div className="flex-1 border-t border-dashed border-border" />
            </div>
            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-primary/5 border border-primary/20">
              <div
                className={cn(
                  'flex items-center justify-center size-7 rounded-full border',
                  getPositionStyle(currentUser.position)
                )}
              >
                {getPositionIcon(currentUser.position)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-primary">
                  {currentUser.name}
                  <span className="text-xs text-muted-foreground ml-1">
                    (você)
                  </span>
                </p>
              </div>
              <span className="text-sm font-semibold text-foreground">
                {currentUser.pontos_total}
                <span className="text-xs text-muted-foreground ml-0.5">
                  pts
                </span>
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
