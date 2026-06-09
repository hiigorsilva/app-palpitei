import { zodResolver } from '@hookform/resolvers/zod'
import {
  type ComponentProps,
  type ReactElement,
  useEffect,
  useState,
} from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { getStorageAuth } from '@/helpers/auth'
import { ErrorResponseApi } from '@/helpers/error'
import { getCountryCodeFromEmoji } from '@/helpers/strings'
import { cn } from '@/lib/utils'
import {
  useCreateGameBet,
  useGetBetsByUserId,
  useUpdateGameBet,
} from '@/services/bets/query'
import type { IBetExpanded } from '@/services/bets/type'
import type { IGame } from '@/services/games/type'
import { useGetUserId } from '@/services/users/query'

type PalpiteValue = IBetExpanded['palpite']

const palpiteOptions = [
  'A',
  'B',
  'EMPATE',
] as const satisfies readonly PalpiteValue[]

const createApostaFormSchema = z.object({
  palpite: z.enum(palpiteOptions, {
    error: 'Selecione um palpite para confirmar sua aposta.',
  }),
  usar_carta_dobro_pontos: z.boolean(),
})

type CreateApostaFormData = z.infer<typeof createApostaFormSchema>

type CreateApostaDrawerProps = ComponentProps<'div'> & {
  bet: IBetExpanded | IGame
  mode: 'create' | 'edit'
  children: ReactElement
}

export function CreateApostaDrawer({
  bet,
  mode = 'create',
  children,
  className,
  ...props
}: CreateApostaDrawerProps) {
  const [open, setOpen] = useState(false)
  const form = useForm<CreateApostaFormData>({
    resolver: zodResolver(createApostaFormSchema),
    mode: 'onChange',
    defaultValues: {
      palpite: undefined,
      usar_carta_dobro_pontos: false,
    },
  })

  const userId = getStorageAuth()?.id
  const { data: user } = useGetUserId(userId!)
  const gameId = 'gameId' in bet ? bet.gameId : bet.id

  const { data: bets } = useGetBetsByUserId(userId!)
  const mutationCreate = useCreateGameBet(userId!, gameId)
  const betDataFiltered = bets?.find(bet => bet.gameId === gameId) ?? null
  const mutationEdit = useUpdateGameBet(
    userId!,
    String(betDataFiltered?.id ?? bet.id)
  )

  const flagTeamA = `/country-flags/${getCountryCodeFromEmoji(bet.team_a_info?.flag_icon || '').toLowerCase()}.webp`
  const flagTeamB = `/country-flags/${getCountryCodeFromEmoji(bet.team_b_info?.flag_icon || '').toLowerCase()}.webp`
  const canShowDoublePointsOption = Boolean(
    user &&
      (user.carta_dobro_pontos > 0 || betDataFiltered?.usou_carta_dobro_pontos)
  )

  async function onSubmit(data: CreateApostaFormData) {
    const payload = {
      palpite: data.palpite,
      usar_carta_dobro_pontos: data.usar_carta_dobro_pontos,
    }

    try {
      if (mode === 'edit' && betDataFiltered) {
        await mutationEdit.mutateAsync(payload)
      }
      if (mode === 'create' && !betDataFiltered) {
        await mutationCreate.mutateAsync(payload)
      }
      setOpen(false)
      form.reset()
    } catch (error) {
      ErrorResponseApi(error)
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)

    if (!nextOpen) {
      form.reset()
    }
  }

  function handleCancel() {
    form.reset()
    setOpen(false)
  }

  useEffect(() => {
    if (betDataFiltered) {
      form.setValue('palpite', betDataFiltered.palpite)
      form.setValue(
        'usar_carta_dobro_pontos',
        betDataFiltered.usou_carta_dobro_pontos
      )
    }
  }, [betDataFiltered, form])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={children} />
      <DialogContent
        className={cn('max-w-[calc(100vw-2rem)] sm:max-w-2xl', className)}
        {...props}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Faça sua aposta</DialogTitle>
              <DialogDescription>
                Selecione o seu palpite para essa partida.
              </DialogDescription>

              <FormField
                control={form.control}
                name="palpite"
                render={({ field }) => (
                  <FormItem className="py-4">
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="grid grid-cols-1 gap-3 sm:grid-cols-3"
                    >
                      <Label
                        htmlFor={`palpite-${bet.id}-A`}
                        className="group flex cursor-pointer items-center gap-2 overflow-hidden rounded-md border bg-muted-background p-2 text-left transition-all has-data-checked:border-primary has-data-checked:bg-primary/10 has-data-checked:text-primary has-focus-visible:ring-3 has-focus-visible:ring-ring/50 sm:flex-col sm:text-center"
                      >
                        <div className="relative z-0 aspect-video w-18 rounded overflow-hidden ring-1 ring-border bg-muted sm:w-28 lg:w-32">
                          <img src={flagTeamA} alt={`Bandeira ${bet.team_a}`} />
                        </div>
                        <h2 className="text-sm font-medium leading-tight sm:text-base">
                          {bet.team_a}
                        </h2>
                        <RadioGroupItem
                          value="A"
                          id={`palpite-${bet.id}-A`}
                          className="sr-only"
                        />
                      </Label>
                      <Label
                        htmlFor={`palpite-${bet.id}-EMPATE`}
                        className="group flex cursor-pointer items-center gap-2 overflow-hidden rounded-md border bg-muted-background p-2 text-left transition-all has-data-checked:border-primary has-data-checked:bg-primary/10 has-data-checked:text-primary has-focus-visible:ring-3 has-focus-visible:ring-ring/50 sm:flex-col sm:text-center"
                      >
                        <div className="relative z-0 flex aspect-video w-18 items-center justify-center rounded overflow-hidden ring-1 ring-border bg-muted sm:w-28 lg:w-32">
                          <img
                            className="w-full"
                            src="/icons/ball.svg"
                            alt="Empate"
                          />
                        </div>
                        <h2 className="text-sm font-medium leading-tight sm:text-base">
                          Empate
                        </h2>
                        <RadioGroupItem
                          value="EMPATE"
                          id={`palpite-${bet.id}-EMPATE`}
                          className="sr-only"
                        />
                      </Label>
                      <Label
                        htmlFor={`palpite-${bet.id}-B`}
                        className="group flex cursor-pointer items-center gap-2 overflow-hidden rounded-md border bg-muted-background p-2 text-left transition-all has-data-checked:border-primary has-data-checked:bg-primary/10 has-data-checked:text-primary has-focus-visible:ring-3 has-focus-visible:ring-ring/50 sm:flex-col sm:text-center"
                      >
                        <div className="relative z-0 aspect-video w-18 rounded overflow-hidden ring-1 ring-border bg-muted sm:w-28 lg:w-32">
                          <img src={flagTeamB} alt={`Bandeira ${bet.team_b}`} />
                        </div>
                        <h2 className="text-sm font-medium leading-tight sm:text-base">
                          {bet.team_b}
                        </h2>
                        <RadioGroupItem
                          value="B"
                          id={`palpite-${bet.id}-B`}
                          className="sr-only"
                        />
                      </Label>
                    </RadioGroup>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {canShowDoublePointsOption && user && (
                <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold">
                        Usar carta de dobro de pontos?
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Você possui {user.carta_dobro_pontos}{' '}
                        {user.carta_dobro_pontos === 1 ? 'carta' : 'cartas'}{' '}
                        {user.carta_dobro_pontos === 1
                          ? 'disponível'
                          : 'disponíveis'}
                      </p>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="usar_carta_dobro_pontos"
                    render={({ field }) => (
                      <FormItem>
                        <RadioGroup
                          value={String(field.value)}
                          onValueChange={value =>
                            field.onChange(value === 'true')
                          }
                          className="grid grid-cols-2 gap-2"
                        >
                          <Label
                            htmlFor={`use-double-points-${bet.id}-true`}
                            className="group flex min-h-16 cursor-pointer flex-col justify-center gap-1 rounded-md border bg-muted-background p-3 text-sm transition-all has-data-checked:bg-primary/10 has-data-checked:border-primary has-data-checked:text-primary has-focus-visible:ring-3 has-focus-visible:ring-ring/50"
                          >
                            <span className="font-semibold">Sim</span>
                            <span className="text-xs text-muted-foreground transition-colors group-has-data-checked:text-primary/80">
                              Dobrar pontos
                            </span>
                            <RadioGroupItem
                              value="true"
                              id={`use-double-points-${bet.id}-true`}
                              className="sr-only"
                            />
                          </Label>
                          <Label
                            htmlFor={`use-double-points-${bet.id}-false`}
                            className="group flex min-h-16 cursor-pointer flex-col justify-center gap-1 rounded-md border bg-muted-background p-3 text-sm transition-all has-data-checked:bg-primary/10 has-data-checked:border-primary has-data-checked:text-primary has-focus-visible:ring-3 has-focus-visible:ring-ring/50"
                          >
                            <span className="font-semibold">Não</span>
                            <span className="text-xs text-muted-foreground transition-colors group-has-data-checked:text-primary/80">
                              Pontuação normal
                            </span>
                            <RadioGroupItem
                              value="false"
                              id={`use-double-points-${bet.id}-false`}
                              className="sr-only"
                            />
                          </Label>
                        </RadioGroup>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <DialogFooter className="w-full flex flex-col-reverse justify-center items-center gap-2 sm:flex-row">
                <Button
                  type="submit"
                  className={'h-10 w-full sm:h-11 sm:flex-1'}
                  disabled={
                    !form.formState.isValid ||
                    mutationCreate.isPending ||
                    mutationEdit.isPending ||
                    (mode === 'edit' && !betDataFiltered)
                  }
                >
                  {mutationCreate.isPending || mutationEdit.isPending
                    ? 'Confirmando...'
                    : 'Confirmar Aposta'}
                </Button>
                <Button
                  type="button"
                  variant={'outline'}
                  className={'h-10 w-full sm:h-11 sm:flex-1'}
                  onClick={handleCancel}
                  disabled={mutationCreate.isPending || mutationEdit.isPending}
                >
                  Cancelar
                </Button>
              </DialogFooter>
            </DialogHeader>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
