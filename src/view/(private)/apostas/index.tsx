import { createFileRoute } from '@tanstack/react-router'
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  ClockIcon,
  HistoryIcon,
  SparklesIcon,
  TargetIcon,
  TrophyIcon,
  XCircleIcon,
  ZapIcon,
} from 'lucide-react'
import { Loading } from '@/components/loading'
import { TitleContainer } from '@/components/title-container'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getStorageAuth } from '@/helpers/auth'
import { formatDateWithoutYear } from '@/helpers/date'
import { cn } from '@/lib/utils'
import { useGetBetsByUserId } from '@/services/bets/query'
import { useRanking } from '@/services/ranking/query'
import { useCartaHistorico } from '@/services/users/query'
import type { ICartaHistoricoItem } from '@/services/users/type'
import { ApostaCardItem } from './-comoponents/aposta-card-item'
import { MiniRanking } from './-comoponents/mini-ranking'

export const Route = createFileRoute('/(private)/apostas/')({
  component: ApostasPage,
  head: () => ({
    meta: [
      {
        title: 'Minhas Apostas | Palpitei',
      },
    ],
  }),
})

function ApostasPage() {
  const navigate = Route.useNavigate()
  const user = getStorageAuth()
  const bets = useGetBetsByUserId(user?.id)
  const ranking = useRanking()
  const cartaHistorico = useCartaHistorico(user?.id)

  if (!user) return <Loading />

  if (!bets.data) return <Loading />
  if (!ranking.data) return <Loading />

  const finishedBets = bets.data.filter(bet => bet.finish_game)
  const upcomingBets = bets.data.filter(bet => !bet.finish_game)

  // Estatísticas
  const totalAcertos = finishedBets.filter(bet => bet.acertou).length
  const totalPontos = finishedBets.reduce((acc, bet) => acc + bet.pontos, 0)
  const aproveitamento =
    finishedBets.length > 0
      ? Math.round((totalAcertos / finishedBets.length) * 100)
      : 0

  function handleBackNavigate() {
    navigate({ to: '..' })
  }

  return (
    <section className="flex flex-col gap-6 px-0">
      <TitleContainer>
        <Button
          size={'icon'}
          variant={'ghost'}
          className={'cursor-pointer'}
          onClick={handleBackNavigate}
        >
          <ArrowLeftIcon />
        </Button>
        Minhas Apostas
      </TitleContainer>

      <p className="text-base text-muted-foreground">
        Acompanhe seus palpites e resultados.
      </p>

      {/* Estatísticas Resumidas */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <div className="flex flex-col items-center justify-center p-4 bg-card border rounded-xl">
          <TrophyIcon className="size-5 text-amber-500 mb-1.5" />
          <span className="text-xl font-bold text-foreground">
            {totalPontos}
          </span>
          <span className="text-xs text-muted-foreground">Pontos</span>
        </div>
        <div className="flex flex-col items-center justify-center p-4 bg-card border rounded-xl">
          <TargetIcon className="size-5 text-green-500 mb-1.5" />
          <span className="text-xl font-bold text-foreground">
            {totalAcertos}/{finishedBets.length}
          </span>
          <span className="text-xs text-muted-foreground">Acertos</span>
        </div>
        <div className="flex flex-col items-center justify-center p-4 bg-card border rounded-xl">
          <SparklesIcon className="size-5 text-blue-500 mb-1.5" />
          <span className="text-xl font-bold text-foreground">
            {aproveitamento}%
          </span>
          <span className="text-xs text-muted-foreground">Aproveitamento</span>
        </div>
      </div>

      {/* LEFTSIDE */}
      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-3">
        <Tabs defaultValue="upcoming" className="w-full lg:col-span-2">
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="upcoming" className="gap-2">
              <ClockIcon className="size-4" />
              Em Breve
              {upcomingBets.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs px-1.5">
                  {upcomingBets.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="finished" className="gap-2">
              <CheckCircle2Icon className="size-4" />
              Encerrados
              {finishedBets.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs px-1.5">
                  {finishedBets.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-0">
            {upcomingBets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ClockIcon className="size-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">
                  Nenhuma aposta pendente no momento
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {upcomingBets
                  .sort(
                    (a, b) =>
                      new Date(a.data_hora).getTime() -
                      new Date(b.data_hora).getTime()
                  )
                  .map(bet => (
                    <ApostaCardItem key={bet.id} bet={bet} />
                  ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="finished" className="mt-0">
            {finishedBets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle2Icon className="size-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">
                  Nenhum jogo encerrado ainda
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {finishedBets
                  .sort(
                    (a, b) =>
                      new Date(b.data_hora).getTime() -
                      new Date(a.data_hora).getTime()
                  )
                  .map(bet => (
                    <ApostaCardItem key={bet.id} bet={bet} />
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* RIGHTSIDE */}
        <div className="h-full w-full space-y-4 lg:space-y-6">
          <MiniRanking currentUserId={user.id} ranking={ranking.data} />

          <div className="rounded-lg border bg-card p-4">
            <h4 className="mb-3 flex items-center gap-2 font-medium">
              <ZapIcon className="h-4 w-4 text-amber-500" />
              Itens Especiais
            </h4>
            <div className="flex items-center justify-between gap-3 rounded-md bg-amber-500/10 p-3">
              <div className="flex min-w-0 items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/20">
                  <span className="text-lg">🃏</span>
                </div>
                <span className="truncate text-sm font-medium">
                  Carta Dobro de Pontos
                </span>
              </div>
              <Badge
                variant="secondary"
                className="bg-amber-500/20 text-amber-600"
              >
                {user.carta_dobro_pontos}x
              </Badge>
            </div>
          </div>

          <CartaHistoricoCard
            historico={cartaHistorico.data ?? []}
            isError={cartaHistorico.isError}
            isLoading={cartaHistorico.isLoading}
          />
        </div>
      </div>
    </section>
  )
}

type CartaHistoricoCardProps = {
  historico: ICartaHistoricoItem[]
  isError: boolean
  isLoading: boolean
}

function CartaHistoricoCard({
  historico,
  isError,
  isLoading,
}: CartaHistoricoCardProps) {
  const usosDaCarta = historico
    .filter(item => item.usou_carta_dobro_pontos)
    .slice()
    .sort(
      (a, b) =>
        new Date(b.data_hora).getTime() - new Date(a.data_hora).getTime()
    )
  const acertosComCarta = usosDaCarta.filter(item => item.acertou).length
  const pontosComCarta = usosDaCarta.reduce((acc, item) => acc + item.pontos, 0)
  const aproveitamentoCarta =
    usosDaCarta.length > 0
      ? Math.round((acertosComCarta / usosDaCarta.length) * 100)
      : 0

  return (
    <div className="rounded-lg border bg-card p-4">
      <h4 className="mb-3 flex items-center gap-2 font-medium">
        <HistoryIcon className="h-4 w-4 text-amber-500" />
        Histórico da Carta
      </h4>

      {isLoading ? (
        <div className="rounded-md bg-muted/50 p-3 text-sm text-muted-foreground">
          Carregando histórico...
        </div>
      ) : isError ? (
        <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-600">
          Não foi possível carregar o histórico.
        </div>
      ) : usosDaCarta.length === 0 ? (
        <div className="rounded-md bg-muted/50 p-3 text-sm text-muted-foreground">
          Você ainda não usou cartas de dobro de pontos.
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <CartaResumoItem label="Usadas" value={usosDaCarta.length} />
            <CartaResumoItem label="Acertos" value={acertosComCarta} />
            <CartaResumoItem
              label="Aproveit."
              value={`${aproveitamentoCarta}%`}
            />
          </div>

          <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
            {usosDaCarta.map(item => (
              <CartaHistoricoItem
                key={`${item.gameId}-${item.data_hora}`}
                item={item}
              />
            ))}
          </div>

          <div className="flex items-center justify-between rounded-md bg-amber-500/10 px-3 py-2">
            <span className="text-xs font-medium text-amber-700">
              Pontos com carta
            </span>
            <Badge
              variant="secondary"
              className="bg-amber-500/20 text-amber-700"
            >
              {pontosComCarta} pts
            </Badge>
          </div>
        </div>
      )}
    </div>
  )
}

function CartaResumoItem({
  label,
  value,
}: {
  label: string
  value: number | string
}) {
  return (
    <div className="rounded-md border bg-muted/30 p-2 text-center">
      <strong className="block text-base leading-none">{value}</strong>
      <span className="mt-1 block truncate text-xs text-muted-foreground">
        {label}
      </span>
    </div>
  )
}

function CartaHistoricoItem({ item }: { item: ICartaHistoricoItem }) {
  const palpiteLabel = getPalpiteLabel(item)

  return (
    <div className="rounded-md border bg-muted/30 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <p className="truncate text-sm font-medium">
            {item.team_a} x {item.team_b}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDateWithoutYear(item.data_hora)}
          </p>
        </div>

        <Badge
          variant="outline"
          className={cn(
            'shrink-0 gap-1',
            item.acertou
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600'
              : 'border-red-500/30 bg-red-500/10 text-red-600'
          )}
        >
          {item.acertou ? (
            <CheckCircle2Icon className="size-3" />
          ) : (
            <XCircleIcon className="size-3" />
          )}
          {item.acertou ? `+${item.pontos}` : '0'}
        </Badge>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">Palpite</span>
        <Badge
          variant="outline"
          className="max-w-40 truncate border-primary/30 bg-primary/10 text-primary"
        >
          {palpiteLabel}
        </Badge>
      </div>
    </div>
  )
}

function getPalpiteLabel(item: ICartaHistoricoItem) {
  if (item.palpite === 'A') return item.team_a
  if (item.palpite === 'B') return item.team_b
  return 'Empate'
}
