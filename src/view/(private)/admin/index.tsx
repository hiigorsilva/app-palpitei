import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import {
  ArrowRightIcon,
  DatabaseIcon,
  Loader2Icon,
  LockKeyholeIcon,
  LogOutIcon,
  RefreshCcwIcon,
  ShieldCheckIcon,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
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
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/contexts/auth'
import { ErrorResponseApi } from '@/helpers/error'
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
import type { IAdminBatchResponse } from '@/services/admin/type'

export const Route = createFileRoute('/(private)/admin/')({
  component: AdminPage,
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

const jsonSchema = z.object({
  payload: z.string().min(1, 'Informe o JSON da requisição'),
})
type JsonFormData = z.infer<typeof jsonSchema>

const batchParticipantsExample = `{
  "jogos": [
    {
      "gameId": "",
      "team_a": "",
      "team_b": ""
    }
  ]
}`

const batchResultsExample = `{
  "resultados": [
    {
      "gameId": "",
      "gols_a": 0,
      "gols_b": 0
    }
  ]
}`

function AdminPage() {
  const queryClient = useQueryClient()
  const { adminLogout, isAdminAuthenticated } = useAuth()
  const [loginOpen, setLoginOpen] = useState(false)

  const dashboard = useAdminDashboard(isAdminAuthenticated)

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
        <Tabs defaultValue="get" className="w-full">
          <TabsList className="grid w-full grid-cols-3 sm:w-fit">
            <TabsTrigger value="get">GET</TabsTrigger>
            <TabsTrigger value="put">PUT</TabsTrigger>
            <TabsTrigger value="post">POST</TabsTrigger>
          </TabsList>

          <TabsContent value="get" className="mt-4">
            <DashboardTab dashboard={dashboard} />
          </TabsContent>

          <TabsContent value="put" className="mt-4">
            <PutActionsTab />
          </TabsContent>

          <TabsContent value="post" className="mt-4">
            <PostActionsTab />
          </TabsContent>
        </Tabs>
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
            Dados gerais retornados por `GET /admin/dashboard`.
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

function PutActionsTab() {
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
        <CorrectResultCard />
        <UpdateParticipantsCard />
        <BatchParticipantsCard className="lg:col-span-2" />
      </div>
    </div>
  )
}

function CorrectResultCard() {
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
      description="PUT /admin/resultado/:gameId"
    >
      <ScoreForm
        formId="correct-result-form"
        form={form}
        submitLabel="Corrigir resultado"
        isPending={mutation.isPending}
        onSubmit={onSubmit}
      />
    </ActionCard>
  )
}

function UpdateParticipantsCard() {
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
      description="PUT /admin/jogos/:gameId/participantes"
    >
      <form
        id="update-participants-form"
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FieldGroup>
          <TextInputField
            control={form.control}
            name="gameId"
            label="Game ID"
            placeholder="ID do jogo"
          />
        </FieldGroup>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInputField
            control={form.control}
            name="team_a"
            label="Seleção A"
            placeholder="Brasil"
          />
          <TextInputField
            control={form.control}
            name="team_b"
            label="Seleção B"
            placeholder="França"
          />
        </div>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Atualizando...' : 'Atualizar participantes'}
        </Button>
      </form>
    </ActionCard>
  )
}

function BatchParticipantsCard({ className }: { className?: string }) {
  const mutation = useAtualizarParticipantesLote()
  const [result, setResult] = useState<IAdminBatchResponse | null>(null)
  const form = useForm<JsonFormData>({
    resolver: zodResolver(jsonSchema),
    defaultValues: {
      payload: batchParticipantsExample,
    },
  })

  async function onSubmit(data: JsonFormData) {
    try {
      const payload = JSON.parse(data.payload)
      const response = await mutation.mutateAsync(payload)
      setResult(response)
      toast.success('Participantes atualizados em lote.')
    } catch (error) {
      ErrorResponseApi(error)
    }
  }

  return (
    <ActionCard
      title="Atualizar participantes em lote"
      description="PUT /admin/jogos/participantes/lote"
      className={className}
    >
      <JsonPayloadForm
        formId="batch-participants-form"
        form={form}
        isPending={mutation.isPending}
        submitLabel="Atualizar lote"
        onSubmit={onSubmit}
      />
      <BatchResult result={result} />
    </ActionCard>
  )
}

function PostActionsTab() {
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

      <div className="grid gap-4 lg:grid-cols-2">
        <OneClickActionsCard />
        <ChampionCard />
        <InsertResultCard />
        <BatchResultsCard />
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
    <ActionCard title="Atualizações de um clique" description="POST">
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

function ChampionCard() {
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
    <ActionCard title="Apurar campeão" description="POST /admin/campeao">
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <TextInputField
          control={form.control}
          name="teamId"
          label="Team ID"
          placeholder="ID da seleção campeã"
        />
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Apurando...' : 'Apurar palpites de campeão'}
        </Button>
      </form>
    </ActionCard>
  )
}

function InsertResultCard() {
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
    <ActionCard title="Inserir resultado" description="POST /admin/resultado">
      <ScoreForm
        formId="insert-result-form"
        form={form}
        submitLabel="Inserir resultado"
        isPending={mutation.isPending}
        onSubmit={onSubmit}
      />
    </ActionCard>
  )
}

function BatchResultsCard() {
  const mutation = useInserirResultadosLote()
  const [result, setResult] = useState<IAdminBatchResponse | null>(null)
  const form = useForm<JsonFormData>({
    resolver: zodResolver(jsonSchema),
    defaultValues: {
      payload: batchResultsExample,
    },
  })

  async function onSubmit(data: JsonFormData) {
    try {
      const payload = JSON.parse(data.payload)
      const response = await mutation.mutateAsync(payload)
      setResult(response)
      toast.success('Resultados inseridos em lote.')
    } catch (error) {
      ErrorResponseApi(error)
    }
  }

  return (
    <ActionCard
      title="Inserir múltiplos resultados"
      description="POST /admin/resultados/lote"
    >
      <JsonPayloadForm
        formId="batch-results-form"
        form={form}
        isPending={mutation.isPending}
        submitLabel="Inserir resultados"
        onSubmit={onSubmit}
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
  submitLabel,
  isPending,
  onSubmit,
}: {
  form: UseFormReturn<ScoreFormData>
  formId: string
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
      <TextInputField
        control={form.control}
        name="gameId"
        label="Game ID"
        placeholder="ID do jogo"
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

function JsonPayloadForm({
  form,
  formId,
  submitLabel,
  isPending,
  onSubmit,
}: {
  form: ReturnType<typeof useForm<JsonFormData>>
  formId: string
  submitLabel: string
  isPending: boolean
  onSubmit: (data: JsonFormData) => void | Promise<void>
}) {
  return (
    <form
      id={formId}
      className="flex flex-col gap-4"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Controller
        name="payload"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={formId}>Body JSON</FieldLabel>
            <textarea
              {...field}
              id={formId}
              aria-invalid={fieldState.invalid}
              className="min-h-48 w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20"
              spellCheck={false}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Processando...' : submitLabel}
      </Button>
    </form>
  )
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

function BatchResult({ result }: { result: IAdminBatchResponse | null }) {
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
