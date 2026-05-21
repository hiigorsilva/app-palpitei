import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import {
  ArrowRightIcon,
  DatabaseIcon,
  HelpCircleIcon,
  Loader2Icon,
  LockKeyholeIcon,
  LogOutIcon,
  RefreshCcwIcon,
  ShieldCheckIcon,
} from 'lucide-react'
import type { ComponentProps, Dispatch, ReactNode, SetStateAction } from 'react'
import { useEffect, useMemo, useState } from 'react'
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
  type UseFormReturn,
  useForm,
} from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'
import { Container } from '@/components/container'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useAuth } from '@/contexts/auth'
import { ErrorResponseApi } from '@/helpers/error'
import { getFaseName } from '@/helpers/games'
import { cn } from '@/lib/utils'
import { getAdminDashboard } from '@/services/admin/api'
import {
  useAdminDashboard,
  useApurarCampeao,
  useAtualizarParticipantesJogo,
  useAtualizarParticipantesLote,
  useCorrigirResultado,
  useInserirResultado,
  useInserirResultadosLote,
  usePopularBaseLocal,
  useRecalcularPontuacao,
} from '@/services/admin/query'
import type { ILoteResponse } from '@/services/admin/type'
import { useListGames } from '@/services/games/query'
import type { IGame } from '@/services/games/type'
import { useListGrupos } from '@/services/grupos/query'
import type { ITeam } from '@/services/grupos/type'

export const Route = createFileRoute('/(private)/admin/')({
  component: AdminPage,
  head: () => ({
    meta: [
      {
        title: 'Painel do Administrador | Palpitei',
      },
    ],
  }),
})

const adminFormSchema = z.object({
  username: z.string().min(1, 'O nome de usuário é obrigatório'),
  password: z.string().min(1, 'A senha é obrigatória'),
})
type AdminFormData = z.infer<typeof adminFormSchema>

const scoreSchema = z.object({
  gameId: z.string().min(1, 'Informe o ID do jogo'),
  gols_a: z.number().int().min(0, 'Os gols não podem ser negativos'),
  gols_b: z.number().int().min(0, 'Os gols não podem ser negativos'),
})
type ScoreFormData = z.infer<typeof scoreSchema>

const correctResultSchema = scoreSchema
type CorrectResultFormData = z.infer<typeof correctResultSchema>

const participantsSchema = z.object({
  gameId: z.string().min(1, 'Informe o ID do jogo'),
  team_a: z.string().min(1, 'Informe a seleção A'),
  team_b: z.string().min(1, 'Informe a seleção B'),
})
type ParticipantsFormData = z.infer<typeof participantsSchema>

const championSchema = z.object({
  teamId: z.string().min(1, 'Informe o ID da seleção campeã'),
})
type ChampionFormData = z.infer<typeof championSchema>

function AdminPage() {
  const queryClient = useQueryClient()
  const { adminLogout, isAdminAuthenticated, user } = useAuth()
  const [loginOpen, setLoginOpen] = useState(false)

  const dashboard = useAdminDashboard(isAdminAuthenticated)
  const games = useListGames(user?.id)
  const teams = useListGrupos(user?.id)

  useEffect(() => {
    if (!isAdminAuthenticated) {
      setLoginOpen(true)
    }
  }, [isAdminAuthenticated])

  function handleAdminLogout() {
    adminLogout()
    queryClient.removeQueries({ queryKey: ['admin'] })
    toast.success('Sessão admin encerrada.')
  }

  return (
    <Container className="flex-1 gap-6 px-4 py-6 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-heading text-2xl font-semibold">
              Painel Administrativo
            </h1>
            <AdminStatusBadge isAuthorized={isAdminAuthenticated} />
          </div>
          <p className="max-w-3xl text-sm text-muted-foreground">
            Consulte informações do sistema e execute rotinas administrativas
            protegidas por credenciais admin.
          </p>
        </div>

        <div className="flex gap-2">
          {isAdminAuthenticated ? (
            <Button variant="outline" onClick={handleAdminLogout}>
              <LogOutIcon className="size-4" />
              Sair do admin
            </Button>
          ) : (
            <Button onClick={() => setLoginOpen(true)}>
              <LockKeyholeIcon className="size-4" />
              Entrar como admin
            </Button>
          )}
        </div>
      </div>

      {isAdminAuthenticated ? (
        <Card className="mt-6 bg-transparent p-4">
          <Tabs defaultValue="get" className="w-full">
            <TabsList className="grid w-full grid-cols-3 sm:w-fit">
              <TabsTrigger value="get">Dashboard geral</TabsTrigger>
              <TabsTrigger value="put">Editar dados</TabsTrigger>
              <TabsTrigger value="post">Adicionar dados</TabsTrigger>
            </TabsList>
            <Separator />
            <TabsContent value="get" className="mt-4">
              <DashboardTab dashboard={dashboard} />
            </TabsContent>

            <TabsContent value="put" className="mt-4">
              <PutActionsTab
                games={games.data ?? []}
                isLoadingGames={games.isLoading}
                isLoadingTeams={teams.isLoading}
                teams={teams.data ?? []}
              />
            </TabsContent>

            <TabsContent value="post" className="mt-4">
              <PostActionsTab
                games={games.data ?? []}
                isLoadingGames={games.isLoading}
                isLoadingTeams={teams.isLoading}
                teams={teams.data ?? []}
              />
            </TabsContent>
          </Tabs>
        </Card>
      ) : (
        <LockedAdminState onLoginClick={() => setLoginOpen(true)} />
      )}

      <AdminLoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </Container>
  )
}

function AdminStatusBadge({ isAuthorized }: { isAuthorized: boolean }) {
  if (isAuthorized) {
    return (
      <Badge variant="secondary" className="gap-1">
        <ShieldCheckIcon className="size-3" />
        Admin autorizado
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="gap-1">
      <LockKeyholeIcon className="size-3" />
      Sessão admin necessária
    </Badge>
  )
}

function LockedAdminState({ onLoginClick }: { onLoginClick: () => void }) {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LockKeyholeIcon className="size-5" />
          Acesso admin necessário
        </CardTitle>
        <CardDescription>
          As consultas e ações desta tela usam Basic Auth admin. Entre com as
          credenciais para carregar o dashboard e liberar as operações.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button onClick={onLoginClick}>
          Entrar como admin
          <ArrowRightIcon className="size-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

function AdminLoginDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { adminLogin, adminLogout } = useAuth()
  const queryClient = useQueryClient()
  const [isPending, setIsPending] = useState(false)

  const form = useForm<AdminFormData>({
    resolver: zodResolver(adminFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  async function onSubmit(data: AdminFormData) {
    try {
      setIsPending(true)
      await adminLogin(data)
      await getAdminDashboard()
      await queryClient.invalidateQueries({ queryKey: ['admin'] })
      form.reset({ username: '', password: '' })
      toast.success('Credenciais admin validadas.')
      onOpenChange(false)
    } catch (error) {
      adminLogout()
      ErrorResponseApi(error)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Login de Administrador</DialogTitle>
          <DialogDescription>
            Informe as credenciais admin para liberar consultas e ações
            protegidas.
          </DialogDescription>
        </DialogHeader>

        <form
          id="admin-login-form"
          className="flex flex-col gap-5"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Controller
            name="username"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="admin-login-username">
                  Nome de usuário
                </FieldLabel>
                <Input
                  {...field}
                  id="admin-login-username"
                  aria-invalid={fieldState.invalid}
                  placeholder="admin"
                  autoComplete="off"
                  autoFocus
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="admin-login-password">Senha</FieldLabel>
                <Input
                  {...field}
                  id="admin-login-password"
                  aria-invalid={fieldState.invalid}
                  placeholder="Digite a senha"
                  autoComplete="off"
                  type="password"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={isPending}
          >
            Limpar
          </Button>
          <Button type="submit" form="admin-login-form" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                Validando...
              </>
            ) : (
              <>
                Entrar
                <ArrowRightIcon className="size-4" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DashboardTab({
  dashboard,
}: {
  dashboard: ReturnType<typeof useAdminDashboard>
}) {
  const items = [
    ['Total de usuários', dashboard.data?.total_usuarios],
    ['Total de apostas', dashboard.data?.total_apostas],
    ['Total de jogos', dashboard.data?.total_jogos],
    ['Jogos encerrados', dashboard.data?.jogos_encerrados],
    ['Jogos pendentes', dashboard.data?.jogos_pendentes],
    ['Usuários com apostas', dashboard.data?.usuarios_com_apostas],
    ['Média de apostas por usuário', dashboard.data?.media_apostas_por_usuario],
  ] as const

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-lg font-semibold">
            Consultas de informações
          </h2>
          <p className="text-sm text-muted-foreground">
            Dados gerais retornados por `GET /api/admin/dashboard`.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => dashboard.refetch()}
          disabled={dashboard.isFetching}
        >
          <RefreshCcwIcon
            className={cn('size-4', dashboard.isFetching && 'animate-spin')}
          />
          Atualizar
        </Button>
      </div>

      {dashboard.isError && (
        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle>Não foi possível carregar os dados</CardTitle>
            <CardDescription>{dashboard.error.message}</CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(([label, value]) => (
          <Card key={label}>
            <CardHeader className="pb-2">
              <CardDescription>{label}</CardDescription>
            </CardHeader>
            <CardContent>
              {dashboard.isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <p className="text-3xl font-semibold tabular-nums">
                  {value ?? '-'}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function PutActionsTab({
  games,
  isLoadingGames,
  isLoadingTeams,
  teams,
}: {
  games: IGame[]
  isLoadingGames: boolean
  isLoadingTeams: boolean
  teams: ITeam[]
}) {
  const knockoutGames = useMemo(() => games.filter(isKnockoutGame), [games])

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-heading text-lg font-semibold">
          Atualizações com dados
        </h2>
        <p className="text-sm text-muted-foreground">
          Operações `PUT` que recebem parâmetros e corpo da requisição.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <CorrectResultCard games={games} isLoadingGames={isLoadingGames} />
        <UpdateParticipantsCard
          games={knockoutGames}
          isLoadingGames={isLoadingGames}
          isLoadingTeams={isLoadingTeams}
          teams={teams}
        />
        <BatchParticipantsCard
          className="lg:col-span-2"
          games={knockoutGames}
          isLoadingGames={isLoadingGames}
          isLoadingTeams={isLoadingTeams}
          teams={teams}
        />
      </div>
    </div>
  )
}

function CorrectResultCard({
  games,
  isLoadingGames,
}: {
  games: IGame[]
  isLoadingGames: boolean
}) {
  const mutation = useCorrigirResultado()
  const form = useForm<CorrectResultFormData>({
    resolver: zodResolver(correctResultSchema),
    defaultValues: {
      gameId: '',
      gols_a: 0,
      gols_b: 0,
    },
  })

  async function onSubmit(data: CorrectResultFormData) {
    try {
      const result = await mutation.mutateAsync({
        gameId: data.gameId,
        payload: {
          gols_a: data.gols_a,
          gols_b: data.gols_b,
        },
      })
      toast.success(result.message)
      form.reset({ gameId: '', gols_a: 0, gols_b: 0 })
    } catch (error) {
      ErrorResponseApi(error)
    }
  }

  return (
    <ActionCard
      title="Corrigir resultado"
      description="PUT /api/admin/resultado/:gameId"
    >
      <div className="flex items-start gap-2 rounded-md border border-dashed bg-muted/30 p-3 text-sm text-muted-foreground">
        <Tooltip>
          <TooltipTrigger className="mt-0.5 inline-flex text-foreground">
            <HelpCircleIcon className="size-4" />
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>
              Este endpoint corrige apenas jogos já encerrados. Para jogos
              pendentes, use Inserir resultado na aba POST.
            </p>
          </TooltipContent>
        </Tooltip>
        <span>O seletor mostra somente jogos encerrados.</span>
      </div>
      <ScoreForm
        formId="correct-result-form"
        form={form}
        submitLabel="Corrigir resultado"
        isPending={mutation.isPending}
        onSubmit={onSubmit}
        games={games.filter(game => game.finish_game)}
        isLoadingGames={isLoadingGames}
      />
    </ActionCard>
  )
}

function UpdateParticipantsCard({
  games,
  isLoadingGames,
  isLoadingTeams,
  teams,
}: {
  games: IGame[]
  isLoadingGames: boolean
  isLoadingTeams: boolean
  teams: ITeam[]
}) {
  const mutation = useAtualizarParticipantesJogo()
  const form = useForm<ParticipantsFormData>({
    resolver: zodResolver(participantsSchema),
    defaultValues: {
      gameId: '',
      team_a: '',
      team_b: '',
    },
  })

  async function onSubmit(data: ParticipantsFormData) {
    try {
      const result = await mutation.mutateAsync({
        gameId: data.gameId,
        payload: {
          team_a: data.team_a,
          team_b: data.team_b,
        },
      })
      toast.success(result.message)
      form.reset({ gameId: '', team_a: '', team_b: '' })
    } catch (error) {
      ErrorResponseApi(error)
    }
  }

  return (
    <ActionCard
      title="Atualizar participantes de um jogo"
      description="PUT /api/admin/jogos/:gameId/participantes"
    >
      <form
        id="update-participants-form"
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FieldGroup>
          <GameSelectField
            control={form.control}
            games={games}
            isLoading={isLoadingGames}
            name="gameId"
            label="Jogo"
          />
        </FieldGroup>
        <div className="grid gap-4 sm:grid-cols-2">
          <TeamSelectField
            control={form.control}
            isLoading={isLoadingTeams}
            name="team_a"
            label="Seleção A"
            teams={teams}
          />
          <TeamSelectField
            control={form.control}
            isLoading={isLoadingTeams}
            name="team_b"
            label="Seleção B"
            teams={teams}
          />
        </div>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Atualizando...' : 'Atualizar participantes'}
        </Button>
      </form>
    </ActionCard>
  )
}

function BatchParticipantsCard({
  className,
  games,
  isLoadingGames,
  isLoadingTeams,
  teams,
}: {
  className?: string
  games: IGame[]
  isLoadingGames: boolean
  isLoadingTeams: boolean
  teams: ITeam[]
}) {
  const mutation = useAtualizarParticipantesLote()
  const [result, setResult] = useState<ILoteResponse | null>(null)
  const [rows, setRows] = useState<Record<string, ParticipantsBatchRow>>({})

  async function onSubmit() {
    try {
      const jogos = games
        .map(game => ({
          gameId: game.id,
          team_a: rows[game.id]?.team_a ?? '',
          team_b: rows[game.id]?.team_b ?? '',
          enabled: rows[game.id]?.enabled ?? false,
        }))
        .filter(row => row.enabled && row.team_a && row.team_b)
        .map(({ gameId, team_a, team_b }) => ({ gameId, team_a, team_b }))

      if (jogos.length === 0) {
        toast.error('Selecione ao menos um jogo completo para atualizar.')
        return
      }

      const response = await mutation.mutateAsync({ jogos })
      setResult(response)
      toast.success('Participantes atualizados em lote.')
    } catch (error) {
      ErrorResponseApi(error)
    }
  }

  return (
    <ActionCard
      title="Atualizar participantes em lote"
      description="PUT /api/admin/jogos/participantes/lote"
      className={className}
    >
      <BatchParticipantsEditor
        games={games}
        isPending={mutation.isPending}
        isLoading={isLoadingGames || isLoadingTeams}
        onSubmit={onSubmit}
        rows={rows}
        setRows={setRows}
        teams={teams}
      />
      <BatchResult result={result} />
    </ActionCard>
  )
}

function PostActionsTab({
  games,
  isLoadingGames,
  isLoadingTeams,
  teams,
}: {
  games: IGame[]
  isLoadingGames: boolean
  isLoadingTeams: boolean
  teams: ITeam[]
}) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-heading text-lg font-semibold">
          Ações de execução
        </h2>
        <p className="text-sm text-muted-foreground">
          Operações `POST` para apuração, resultados e manutenção da base.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <OneClickActionsCard />
        <ChampionCard isLoadingTeams={isLoadingTeams} teams={teams} />
        <InsertResultCard
          games={games.filter(game => !game.finish_game)}
          isLoadingGames={isLoadingGames}
        />
        <div className="col-span-3">
          <BatchResultsCard
            games={games.filter(game => !game.finish_game)}
            isLoadingGames={isLoadingGames}
          />
        </div>
      </div>
    </div>
  )
}

function OneClickActionsCard() {
  const recalculate = useRecalcularPontuacao()
  const populate = usePopularBaseLocal()

  async function handleRecalculate() {
    try {
      const result = await recalculate.mutateAsync()
      toast.success(result.message)
    } catch (error) {
      ErrorResponseApi(error)
    }
  }

  async function handlePopulate() {
    const confirmed = window.confirm(
      'Deseja popular/resetar as informações da base local?'
    )

    if (!confirmed) return

    try {
      const result = await populate.mutateAsync()
      toast.success(
        `Base atualizada: ${result.teams_inseridos} seleções inseridas e ${result.jogos_inseridos} jogos inseridos.`
      )
    } catch (error) {
      ErrorResponseApi(error)
    }
  }

  return (
    <ActionCard
      title="Atualizações de um clique"
      description="POST /api/admin/recalcular | POST /api/admin/popular-base"
    >
      <div className="grid gap-3">
        <Button
          variant="outline"
          onClick={handleRecalculate}
          disabled={recalculate.isPending}
        >
          <RefreshCcwIcon
            className={cn('size-4', recalculate.isPending && 'animate-spin')}
          />
          Recalcular toda a pontuação
        </Button>
        <Button
          variant="destructive"
          onClick={handlePopulate}
          disabled={populate.isPending}
        >
          <DatabaseIcon className="size-4" />
          Popular banco de dados
        </Button>
      </div>
    </ActionCard>
  )
}

function ChampionCard({
  isLoadingTeams,
  teams,
}: {
  isLoadingTeams: boolean
  teams: ITeam[]
}) {
  const mutation = useApurarCampeao()
  const form = useForm<ChampionFormData>({
    resolver: zodResolver(championSchema),
    defaultValues: {
      teamId: '',
    },
  })

  async function onSubmit(data: ChampionFormData) {
    try {
      const result = await mutation.mutateAsync(data.teamId)
      toast.success(
        `${result.campeao} apurado: ${result.palpites_corretos} palpites corretos.`
      )
      form.reset({ teamId: '' })
    } catch (error) {
      ErrorResponseApi(error)
    }
  }

  return (
    <ActionCard title="Apurar campeão" description="POST /api/admin/campeao">
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <TeamSelectField
          control={form.control}
          isLoading={isLoadingTeams}
          name="teamId"
          label="Seleção campeã"
          teams={teams}
          valueMode="id"
        />
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Apurando...' : 'Apurar palpites de campeão'}
        </Button>
      </form>
    </ActionCard>
  )
}

function InsertResultCard({
  games,
  isLoadingGames,
}: {
  games: IGame[]
  isLoadingGames: boolean
}) {
  const mutation = useInserirResultado()
  const form = useForm<ScoreFormData>({
    resolver: zodResolver(scoreSchema),
    defaultValues: {
      gameId: '',
      gols_a: 0,
      gols_b: 0,
    },
  })

  async function onSubmit(data: ScoreFormData) {
    try {
      const result = await mutation.mutateAsync(data)
      toast.success(result.message)
      form.reset({ gameId: '', gols_a: 0, gols_b: 0 })
    } catch (error) {
      ErrorResponseApi(error)
    }
  }

  return (
    <ActionCard
      title="Inserir resultado"
      description="POST /api/admin/resultado"
    >
      <ScoreForm
        formId="insert-result-form"
        form={form}
        submitLabel="Inserir resultado"
        isPending={mutation.isPending}
        onSubmit={onSubmit}
        games={games}
        isLoadingGames={isLoadingGames}
      />
    </ActionCard>
  )
}

function BatchResultsCard({
  games,
  isLoadingGames,
}: {
  games: IGame[]
  isLoadingGames: boolean
}) {
  const mutation = useInserirResultadosLote()
  const [result, setResult] = useState<ILoteResponse | null>(null)
  const [rows, setRows] = useState<Record<string, ResultBatchRow>>({})

  async function onSubmit() {
    try {
      const resultados = games
        .map(game => ({
          gameId: game.id,
          gols_a: rows[game.id]?.gols_a,
          gols_b: rows[game.id]?.gols_b,
          enabled: rows[game.id]?.enabled ?? false,
        }))
        .filter(
          row =>
            row.enabled &&
            Number.isInteger(row.gols_a) &&
            Number.isInteger(row.gols_b) &&
            Number(row.gols_a) >= 0 &&
            Number(row.gols_b) >= 0
        )
        .map(({ gameId, gols_a, gols_b }) => ({
          gameId,
          gols_a: Number(gols_a),
          gols_b: Number(gols_b),
        }))

      if (resultados.length === 0) {
        toast.error('Selecione ao menos um jogo com placar completo.')
        return
      }

      const response = await mutation.mutateAsync({ resultados })
      setResult(response)
      toast.success('Resultados inseridos em lote.')
    } catch (error) {
      ErrorResponseApi(error)
    }
  }

  return (
    <ActionCard
      title="Inserir múltiplos resultados"
      description="POST /api/admin/resultados/lote"
    >
      <BatchResultsEditor
        games={games}
        isPending={mutation.isPending}
        isLoading={isLoadingGames}
        onSubmit={onSubmit}
        rows={rows}
        setRows={setRows}
      />
      <BatchResult result={result} />
    </ActionCard>
  )
}

function ActionCard({
  title,
  description,
  children,
  className,
}: {
  title: string
  description: string
  children: ReactNode
  className?: string
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  )
}

function ScoreForm({
  form,
  formId,
  games,
  isLoadingGames,
  submitLabel,
  isPending,
  onSubmit,
}: {
  form: UseFormReturn<ScoreFormData>
  formId: string
  games: IGame[]
  isLoadingGames: boolean
  submitLabel: string
  isPending: boolean
  onSubmit: (data: ScoreFormData) => void | Promise<void>
}) {
  return (
    <form
      id={formId}
      className="flex flex-col gap-4"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <GameSelectField
        control={form.control}
        games={games}
        isLoading={isLoadingGames}
        name="gameId"
        label="Jogo"
      />
      <div className="grid grid-cols-2 gap-4">
        <TextInputField
          control={form.control}
          name="gols_a"
          label="Gols A"
          placeholder="0"
          type="number"
        />
        <TextInputField
          control={form.control}
          name="gols_b"
          label="Gols B"
          placeholder="0"
          type="number"
        />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Processando...' : submitLabel}
      </Button>
    </form>
  )
}

type ResultBatchRow = {
  enabled: boolean
  gols_a?: number
  gols_b?: number
}

type ParticipantsBatchRow = {
  enabled: boolean
  team_a?: string
  team_b?: string
}

function BatchResultsEditor({
  games,
  isLoading,
  isPending,
  onSubmit,
  rows,
  setRows,
}: {
  games: IGame[]
  isLoading: boolean
  isPending: boolean
  onSubmit: () => void | Promise<void>
  rows: Record<string, ResultBatchRow>
  setRows: Dispatch<SetStateAction<Record<string, ResultBatchRow>>>
}) {
  if (isLoading) {
    return <Skeleton className="h-48 w-full" />
  }

  if (games.length === 0) {
    return <EmptyActionMessage message="Não há jogos pendentes para apurar." />
  }

  return (
    <div className="space-y-3">
      <div className="overflow-auto rounded-md border">
        <Table className="w-full min-w-180 text-sm">
          <TableHeader className="bg-muted/50 text-left">
            <TableRow>
              <TableHead className="w-16 px-3 py-2 font-medium">
                Incluir
              </TableHead>
              <TableHead className="px-3 py-2 font-medium">Jogo</TableHead>
              <TableHead className="w-28 px-3 py-2 font-medium">
                Gols A
              </TableHead>
              <TableHead className="w-28 px-3 py-2 font-medium">
                Gols B
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {games.map(game => (
              <TableRow key={game.id} className="border-t">
                <TableCell className="px-3 py-2">
                  <input
                    type="checkbox"
                    className="size-4 accent-primary"
                    checked={rows[game.id]?.enabled ?? false}
                    onChange={event =>
                      setRows(current => ({
                        ...current,
                        [game.id]: {
                          ...current[game.id],
                          enabled: event.target.checked,
                        },
                      }))
                    }
                  />
                </TableCell>
                <TableCell className="px-3 py-2">
                  <GameSummary game={game} />
                </TableCell>
                <TableCell className="px-3 py-2">
                  <Input
                    min={0}
                    type="number"
                    value={rows[game.id]?.gols_a ?? ''}
                    onChange={event =>
                      setRows(current => ({
                        ...current,
                        [game.id]: {
                          ...current[game.id],
                          enabled: true,
                          gols_a: event.target.valueAsNumber,
                        },
                      }))
                    }
                  />
                </TableCell>
                <TableCell className="px-3 py-2">
                  <Input
                    min={0}
                    type="number"
                    value={rows[game.id]?.gols_b ?? ''}
                    onChange={event =>
                      setRows(current => ({
                        ...current,
                        [game.id]: {
                          ...current[game.id],
                          enabled: true,
                          gols_b: event.target.valueAsNumber,
                        },
                      }))
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Button onClick={onSubmit} disabled={isPending}>
        {isPending ? 'Inserindo...' : 'Inserir resultados selecionados'}
      </Button>
    </div>
  )
}

function BatchParticipantsEditor({
  games,
  isLoading,
  isPending,
  onSubmit,
  rows,
  setRows,
  teams,
}: {
  games: IGame[]
  isLoading: boolean
  isPending: boolean
  onSubmit: () => void | Promise<void>
  rows: Record<string, ParticipantsBatchRow>
  setRows: Dispatch<SetStateAction<Record<string, ParticipantsBatchRow>>>
  teams: ITeam[]
}) {
  if (isLoading) {
    return <Skeleton className="h-48 w-full" />
  }

  if (games.length === 0) {
    return (
      <EmptyActionMessage message="Não há jogos de mata-mata disponíveis." />
    )
  }

  return (
    <div className="space-y-3">
      <div className="overflow-auto rounded-md border">
        <table className="w-full min-w-215 text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="w-16 px-3 py-2 font-medium">Incluir</th>
              <th className="px-3 py-2 font-medium">Jogo</th>
              <th className="w-56 px-3 py-2 font-medium">Seleção A</th>
              <th className="w-56 px-3 py-2 font-medium">Seleção B</th>
            </tr>
          </thead>
          <tbody>
            {games.map(game => (
              <tr key={game.id} className="border-t">
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    className="size-4 accent-primary"
                    checked={rows[game.id]?.enabled ?? false}
                    onChange={event =>
                      setRows(current => ({
                        ...current,
                        [game.id]: {
                          ...current[game.id],
                          enabled: event.target.checked,
                        },
                      }))
                    }
                  />
                </td>
                <td className="px-3 py-2">
                  <GameSummary game={game} />
                </td>
                <td className="px-3 py-2">
                  <NativeSelect
                    value={rows[game.id]?.team_a ?? ''}
                    onChange={event =>
                      setRows(current => ({
                        ...current,
                        [game.id]: {
                          ...current[game.id],
                          enabled: true,
                          team_a: event.target.value,
                        },
                      }))
                    }
                  >
                    <option value="">Seleção A</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.name}>
                        {team.name}
                      </option>
                    ))}
                  </NativeSelect>
                </td>
                <td className="px-3 py-2">
                  <NativeSelect
                    value={rows[game.id]?.team_b ?? ''}
                    onChange={event =>
                      setRows(current => ({
                        ...current,
                        [game.id]: {
                          ...current[game.id],
                          enabled: true,
                          team_b: event.target.value,
                        },
                      }))
                    }
                  >
                    <option value="">Seleção B</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.name}>
                        {team.name}
                      </option>
                    ))}
                  </NativeSelect>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button onClick={onSubmit} disabled={isPending}>
        {isPending ? 'Atualizando...' : 'Atualizar participantes selecionados'}
      </Button>
    </div>
  )
}

function GameSelectField<T extends FieldValues>({
  control,
  games,
  isLoading,
  label,
  name,
}: {
  control: Control<T>
  games: IGame[]
  isLoading: boolean
  label: string
  name: Path<T>
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <NativeSelect
            id={name}
            name={field.name}
            ref={field.ref}
            value={String(field.value ?? '')}
            disabled={isLoading || games.length === 0}
            onBlur={field.onBlur}
            onChange={event => field.onChange(event.target.value)}
          >
            <option value="">
              {isLoading ? 'Carregando jogos...' : 'Selecione um jogo'}
            </option>
            {games.map(game => (
              <option key={game.id} value={game.id}>
                {formatGameLabel(game)}
              </option>
            ))}
          </NativeSelect>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}

function TeamSelectField<T extends FieldValues>({
  control,
  isLoading,
  label,
  name,
  teams,
  valueMode = 'name',
}: {
  control: Control<T>
  isLoading: boolean
  label: string
  name: Path<T>
  teams: ITeam[]
  valueMode?: 'id' | 'name'
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <NativeSelect
            id={name}
            name={field.name}
            ref={field.ref}
            value={String(field.value ?? '')}
            disabled={isLoading || teams.length === 0}
            onBlur={field.onBlur}
            onChange={event => field.onChange(event.target.value)}
          >
            <option value="">
              {isLoading ? 'Carregando seleções...' : 'Selecione uma seleção'}
            </option>
            {teams.map(team => (
              <option
                key={team.id}
                value={valueMode === 'id' ? team.id : team.name}
              >
                {team.name}
              </option>
            ))}
          </NativeSelect>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}

const selectClassName =
  'h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20'

const NativeSelect = ({ className, ...props }: ComponentProps<'select'>) => (
  <select className={cn(selectClassName, className)} {...props} />
)

function GameSummary({ game }: { game: IGame }) {
  return (
    <div className="space-y-1">
      <div className="font-medium">{formatGameTeams(game)}</div>
      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span>{getFaseName(game.fase)}</span>
        <span>{formatGameDate(game.data_hora)}</span>
        {game.finish_game && (
          <Badge variant="outline" className="h-5">
            Encerrado
          </Badge>
        )}
      </div>
    </div>
  )
}

function EmptyActionMessage({ message }: { message: string }) {
  return (
    <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
      {message}
    </div>
  )
}

function formatGameLabel(game: IGame) {
  return `${formatGameTeams(game)} - ${getFaseName(game.fase)} - ${formatGameDate(game.data_hora)}`
}

function formatGameTeams(game: IGame) {
  const score =
    game.gols_a !== null && game.gols_b !== null
      ? ` ${game.gols_a} x ${game.gols_b} `
      : ' x '

  return `${game.team_a}${score}${game.team_b}`
}

function formatGameDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: '2-digit',
  }).format(new Date(date))
}

function isKnockoutGame(game: IGame) {
  return game.fase !== 'GRUPOS'
}

function TextInputField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = 'text',
}: {
  control: Control<T>
  name: Path<T>
  label: string
  placeholder: string
  type?: string
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <Input
            name={field.name}
            ref={field.ref}
            onBlur={field.onBlur}
            onChange={event => {
              if (type === 'number') {
                field.onChange(event.target.valueAsNumber)
                return
              }

              field.onChange(event.target.value)
            }}
            value={
              typeof field.value === 'number' || typeof field.value === 'string'
                ? field.value
                : ''
            }
            id={name}
            aria-invalid={fieldState.invalid}
            placeholder={placeholder}
            type={type}
            autoComplete="off"
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}

function BatchResult({ result }: { result: ILoteResponse | null }) {
  if (!result) return null

  return (
    <div className="rounded-md border bg-muted/30 p-3 text-sm">
      <div className="mb-2 flex flex-wrap gap-2">
        <Badge variant="secondary">Sucesso: {result.sucesso}</Badge>
        <Badge variant={result.erros > 0 ? 'destructive' : 'outline'}>
          Erros: {result.erros}
        </Badge>
      </div>
      <div className="max-h-40 space-y-2 overflow-auto">
        {result.detalhes.map(item => (
          <div
            key={item.gameId}
            className="flex flex-col gap-1 rounded-md bg-background p-2 sm:flex-row sm:items-center sm:justify-between"
          >
            <span className="font-mono text-xs">{item.gameId}</span>
            <span className="text-muted-foreground">{item.message}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
