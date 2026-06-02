import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  CircleHelpIcon,
  GiftIcon,
  LightbulbIcon,
  MedalIcon,
  SparklesIcon,
  TargetIcon,
  TrophyIcon,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { TitleContainer } from '@/components/title-container'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getStorageAuth } from '@/helpers/auth'
import { cn } from '@/lib/utils'
import { useGetBonusUser, useListNiveisBonus } from '@/services/bonus/query'
import type { IBonusNivel, IBonusProgressResponse } from '@/services/bonus/type'

export const Route = createFileRoute('/(private)/como-pontuar/')({
  component: ComoPontuarPage,
  head: () => ({
    meta: [
      {
        title: 'Como pontuar | Palpitei',
      },
    ],
  }),
})

function ComoPontuarPage() {
  const navigate = Route.useNavigate()
  const auth = getStorageAuth()
  const bonusProgress = useGetBonusUser(auth?.id)
  const bonusLevels = useListNiveisBonus()
  const isLoading = bonusProgress.isLoading || bonusLevels.isLoading
  const isError = bonusProgress.isError || bonusLevels.isError

  if (isLoading) {
    return <PontuacaoGuideSkeleton />
  }

  if (isError || !bonusProgress.data || !bonusLevels.data) {
    return (
      <GuideErrorState
        onRetry={() => {
          bonusProgress.refetch()
          bonusLevels.refetch()
        }}
      />
    )
  }

  function handleBackNavigate() {
    navigate({ to: '..' })
  }

  return (
    <section className="flex min-w-0 flex-col gap-6">
      <header className="space-y-2">
        <TitleContainer>
          <Button
            size={'icon'}
            variant={'ghost'}
            className={'cursor-pointer'}
            onClick={handleBackNavigate}
          >
            <ArrowLeftIcon />
          </Button>
          Como pontuar
        </TitleContainer>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Entenda como ganhar pontos, subir de nível e melhorar sua posição no
          ranking.
        </p>
      </header>

      <ProgressOverview
        levels={bonusLevels.data}
        progress={bonusProgress.data}
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
        <div className="flex min-w-0 flex-col gap-4">
          <BetScoreCard />
          <ParticipationBonusCard />
          <BonusLevelsCard
            levels={bonusLevels.data}
            progress={bonusProgress.data}
          />
        </div>

        <aside className="flex min-w-0 flex-col gap-4">
          <RankingFormulaCard />
          <TipsCard />
          <GamesShortcutCard />
        </aside>
      </div>
    </section>
  )
}

function ProgressOverview({
  levels,
  progress,
}: {
  levels: IBonusNivel[]
  progress: IBonusProgressResponse
}) {
  const currentLevel = formatLevel(progress.nivel_atual)
  const nextLevel = progress.proximo_nivel
  const missingBets = calculateMissingBets(
    progress.jogos_apostados,
    progress.total_jogos,
    nextLevel
  )
  const progressToNextLevel = calculateNextLevelProgress(
    progress.jogos_apostados,
    progress.total_jogos,
    nextLevel
  )
  const nextRequiredGames = nextLevel
    ? calculateRequiredGames(progress.total_jogos, nextLevel.minimoPercentual)
    : progress.total_jogos

  if (progress.total_jogos === 0) {
    return (
      <Empty className="bg-card">
        <EmptyMedia variant="icon">
          <CircleHelpIcon />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>Os jogos ainda não foram cadastrados</EmptyTitle>
          <EmptyDescription>
            Quando os jogos estiverem disponíveis, você poderá acompanhar seu
            progresso aqui.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Seu progresso</CardTitle>
            <CardDescription>
              Você apostou em {progress.jogos_apostados} de{' '}
              {progress.total_jogos} jogos.
            </CardDescription>
          </div>
          <Badge className="w-fit bg-primary/15 text-primary" variant="outline">
            {progress.percentual.toFixed(0)}% de participação
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-3">
          <ProgressMetric
            icon={<MedalIcon className="size-5 text-amber-500" />}
            label="Nível atual"
            value={currentLevel}
          />
          <ProgressMetric
            icon={<GiftIcon className="size-5 text-pink-500" />}
            label="Bônus atual"
            value={`+${progress.bonus_concedido} pontos`}
          />
          <ProgressMetric
            icon={<TargetIcon className="size-5 text-emerald-500" />}
            label="Jogos apostados"
            value={`${progress.jogos_apostados}/${progress.total_jogos}`}
          />
        </div>

        <div className="rounded-lg border bg-muted/30 p-4">
          {nextLevel ? (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <span className="font-medium">
                  <span className="capitalize">{currentLevel}</span> até{' '}
                  <span className="capitalize">
                    {formatLevel(nextLevel.nivel)}
                  </span>
                </span>
                <span className="text-muted-foreground">
                  {progress.jogos_apostados} de {nextRequiredGames} jogos
                  necessários
                </span>
              </div>
              <Progress value={progressToNextLevel} className="h-2" />
              <p className="text-sm text-muted-foreground">
                Faltam{' '}
                <strong className="font-semibold text-foreground">
                  {missingBets} {missingBets === 1 ? 'palpite' : 'palpites'}
                </strong>{' '}
                para chegar ao {formatLevel(nextLevel.nivel)} e ganhar +
                {nextLevel.bonusPontos} pontos.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <span className="font-medium">
                  Você chegou ao nível máximo: {currentLevel}
                </span>
                <span className="text-muted-foreground">
                  Progresso completo
                </span>
              </div>
              <Progress value={100} className="h-2" />
              <p className="text-sm text-muted-foreground">
                Seu bônus de participação atual é de +{progress.bonus_concedido}{' '}
                pontos.
              </p>
            </div>
          )}
        </div>

        {progress.jogos_apostados === 0 && (
          <div className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
            Você ainda não fez palpites. Comece apostando nos jogos disponíveis
            para iniciar seu progresso.
          </div>
        )}

        {levels.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {levels.map(level => (
              <LevelBadge
                key={level.nivel}
                isCurrent={sameLevel(level.nivel, progress.nivel_atual)}
                isNext={sameLevel(level.nivel, nextLevel?.nivel)}
                level={level}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ProgressMetric({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-muted/40 p-3">
      {icon}
      <div className="min-w-0">
        <p className="truncate text-xs text-muted-foreground capitalize">
          {label}
        </p>
        <p className="truncate text-lg font-semibold capitalize">{value}</p>
      </div>
    </div>
  )
}

function LevelBadge({
  isCurrent,
  isNext,
  level,
}: {
  isCurrent: boolean
  isNext: boolean
  level: IBonusNivel
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'h-auto gap-1.5 px-2.5 py-1 capitalize',
        isCurrent && 'border-primary/30 bg-primary/10 text-primary',
        isNext && 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700'
      )}
    >
      {formatLevel(level.nivel)}
    </Badge>
  )
}

function BetScoreCard() {
  return (
    <GuideCard
      icon={<TrophyIcon className="size-5 text-blue-500" />}
      title="Como os palpites pontuam"
      description="Você ganha pontos quando acerta o resultado do jogo."
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <ScoreRule label="Acertou o vencedor" value="+7 pontos" />
        <ScoreRule label="Acertou empate" value="+5 pontos" />
        <ScoreRule label="Errou o palpite" value="0 pontos" />
      </div>

      <div className="rounded-lg border bg-muted/30 p-4">
        <div className="flex items-start gap-3">
          <SparklesIcon className="mt-0.5 size-5 text-amber-500" />
          <p className="text-sm text-muted-foreground">
            Se usar uma carta de dobro de pontos em um palpite correto, os
            pontos daquele jogo são dobrados. Um acerto de vencedor pode valer
            +14 pontos.
          </p>
        </div>
      </div>
    </GuideCard>
  )
}

function ScoreRule({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-card p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  )
}

function ParticipationBonusCard() {
  return (
    <GuideCard
      icon={<GiftIcon className="size-5 text-pink-500" />}
      title="Bônus de participação"
      description="Esse bônus recompensa quem participa mais do bolão."
    >
      <div className="space-y-3 text-sm text-muted-foreground">
        <p>
          Ele não depende de acertar os jogos. Para subir de nível, você precisa
          palpitar em mais partidas.
        </p>
        <p>
          Quanto mais jogos você palpitar, maior será seu nível de participação
          e maior será o bônus somado ao seu ranking.
        </p>
      </div>
    </GuideCard>
  )
}

function BonusLevelsCard({
  levels,
  progress,
}: {
  levels: IBonusNivel[]
  progress: IBonusProgressResponse
}) {
  return (
    <GuideCard
      icon={<MedalIcon className="size-5 text-amber-500" />}
      title="Níveis de bônus"
      description="Veja quantos jogos são necessários para alcançar cada nível."
    >
      <div className="overflow-auto rounded-md border">
        <Table className="min-w-150">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Nível</TableHead>
              <TableHead className="text-right">Participação mínima</TableHead>
              <TableHead className="text-right">Jogos necessários</TableHead>
              <TableHead className="text-right">Bônus</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {levels.map(level => {
              const isCurrent = sameLevel(level.nivel, progress.nivel_atual)
              const isNext = sameLevel(
                level.nivel,
                progress.proximo_nivel?.nivel
              )

              return (
                <TableRow
                  key={level.nivel}
                  className={cn(isCurrent && 'bg-primary/5')}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {formatLevel(level.nivel)}
                      </span>
                      {isCurrent && (
                        <Badge variant="outline" className="text-xs">
                          Atual
                        </Badge>
                      )}
                      {isNext && (
                        <Badge className="bg-emerald-500/15 text-emerald-700">
                          Próximo
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {level.minimoPercentual}%
                  </TableCell>
                  <TableCell className="text-right">
                    {calculateRequiredGames(
                      progress.total_jogos,
                      level.minimoPercentual
                    )}{' '}
                    jogos
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    +{level.bonusPontos} pontos
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </GuideCard>
  )
}

function RankingFormulaCard() {
  return (
    <GuideCard
      icon={<CheckCircle2Icon className="size-5 text-emerald-500" />}
      title="Como o ranking é calculado"
      description="Sua pontuação total soma três partes."
    >
      <div className="space-y-2 text-sm">
        <FormulaItem label="Acertos nos jogos" />
        <FormulaItem label="Bônus de participação" />
        <FormulaItem label="Palpite de campeão" />
      </div>
      <p className="text-sm text-muted-foreground">
        Acertos aumentam seus pontos de apostas. O bônus de participação aumenta
        quando você palpita em mais jogos.
      </p>
    </GuideCard>
  )
}

function FormulaItem({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md bg-muted/40 px-3 py-2">
      <CheckCircle2Icon className="size-4 text-emerald-500" />
      <span>{label}</span>
    </div>
  )
}

function TipsCard() {
  const tips = [
    'Aposte em mais jogos para subir seu nível de participação.',
    'Você não precisa acertar para avançar no bônus de participação.',
    'Use a carta de dobro nos jogos em que estiver mais confiante.',
    'Palpitar em todos os jogos aumenta suas chances de pontuar.',
    'Confira os jogos sem palpite para não perder oportunidades.',
  ]

  return (
    <GuideCard
      icon={<LightbulbIcon className="size-5 text-yellow-500" />}
      title="Dicas para ganhar mais pontos"
      description="Pequenas ações que ajudam no ranking."
    >
      <div className="space-y-2">
        {tips.map(tip => (
          <div key={tip} className="flex items-start gap-2 text-sm">
            <ArrowRightIcon className="mt-0.5 size-4 shrink-0 text-primary" />
            <span className="text-muted-foreground">{tip}</span>
          </div>
        ))}
      </div>
    </GuideCard>
  )
}

function GamesShortcutCard() {
  const navigate = useNavigate()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximo passo</CardTitle>
        <CardDescription>
          Veja a lista de jogos e registre os palpites que ainda faltam.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button className="w-full" onClick={() => navigate({ to: '/jogos' })}>
          Ver jogos
          <ArrowRightIcon className="size-4" />
        </Button>
      </CardContent>
    </Card>
  )
}

function GuideCard({
  children,
  description,
  icon,
  title,
}: {
  children: ReactNode
  description: string
  icon: ReactNode
  title: string
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
            {icon}
          </span>
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  )
}

function PontuacaoGuideSkeleton() {
  return (
    <section className="flex min-w-0 flex-col gap-6">
      <header className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </header>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
          <Skeleton className="h-28" />
        </CardContent>
      </Card>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
        <div className="space-y-4">
          <Skeleton className="h-48" />
          <Skeleton className="h-40" />
          <Skeleton className="h-72" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-52" />
          <Skeleton className="h-64" />
        </div>
      </div>
    </section>
  )
}

function GuideErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <Empty className="bg-card">
      <EmptyMedia variant="icon">
        <CircleHelpIcon />
      </EmptyMedia>
      <EmptyHeader>
        <EmptyTitle>Não foi possível carregar as dicas de pontuação</EmptyTitle>
        <EmptyDescription>
          Tente novamente em instantes para acompanhar seu progresso e os níveis
          de bônus.
        </EmptyDescription>
      </EmptyHeader>
      <Button onClick={onRetry}>Tentar novamente</Button>
    </Empty>
  )
}

function calculateRequiredGames(totalGames: number, minimumPercentage: number) {
  return Math.ceil((totalGames * minimumPercentage) / 100)
}

function calculateMissingBets(
  placedBets: number,
  totalGames: number,
  nextLevel: { minimoPercentual: number } | null
) {
  if (!nextLevel) return 0

  const requiredGames = calculateRequiredGames(
    totalGames,
    nextLevel.minimoPercentual
  )

  return Math.max(requiredGames - placedBets, 0)
}

function calculateNextLevelProgress(
  placedBets: number,
  totalGames: number,
  nextLevel: { minimoPercentual: number } | null
) {
  if (!nextLevel) return 100

  const requiredGames = calculateRequiredGames(
    totalGames,
    nextLevel.minimoPercentual
  )

  if (requiredGames <= 0) return 0

  return Math.min((placedBets / requiredGames) * 100, 100)
}

function sameLevel(left: string | undefined, right: string | undefined) {
  return left?.toLocaleLowerCase() === right?.toLocaleLowerCase()
}

function formatLevel(level: string) {
  return level.toLocaleLowerCase()
}
