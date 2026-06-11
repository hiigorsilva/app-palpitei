import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute } from '@tanstack/react-router'
import { ArrowLeftIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'
import { TitleContainer } from '@/components/title-container'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { getStorageAuth } from '@/helpers/auth'
import { ErrorResponseApi } from '@/helpers/error'
import { getCountryCodeFromEmoji, imagesUrl } from '@/helpers/strings'
import { cn } from '@/lib/utils'
import { useListGrupos } from '@/services/grupos/query'
import type { ITeam } from '@/services/grupos/type'
import { useUpdatePalpiteCampeao } from '@/services/users/query'
import { Group } from './-components/grid-teams'

export const Route = createFileRoute('/(private)/grupos/')({
  component: GruposPage,
  head: () => ({
    meta: [
      {
        title: 'Grupos e Seleções | Palpitei',
      },
    ],
  }),
})

function GruposPage() {
  const [open, setOpen] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<ITeam | null>(null)

  const userId = getStorageAuth()?.id
  const grupos = useListGrupos(userId)

  const navigate = Route.useNavigate()

  const groupedTeams = () => {
    return grupos.data?.reduce(
      (acc, current) => {
        const group = acc.find(g => g.group === current.group)
        if (group) group.teams.push(current)
        else acc.push({ group: current.group, teams: [current] })
        return acc
      },
      [] as { group: string; teams: ITeam[] }[]
    )
  }

  function handleBackNavigate() {
    navigate({ to: '..' })
  }

  function handleFavoriteTeamDialogOpenChange(isOpen: boolean) {
    setOpen(isOpen)

    if (!isOpen) {
      setSelectedTeam(null)
    }
  }

  function handleOpenFavoriteTeamDialog(team: ITeam) {
    setSelectedTeam(team)
    setOpen(true)
  }

  return (
    <section className="flex flex-col gap-6 min-h-full h-fit">
      <TitleContainer>
        <Button
          size={'icon'}
          variant={'ghost'}
          className={'cursor-pointer'}
          onClick={handleBackNavigate}
        >
          <ArrowLeftIcon />
        </Button>
        Grupos e Seleções
      </TitleContainer>

      <p className="text-base text-muted-foreground">
        Clique em uma seleção para ser seu palpite de Campeão da Copa do Mundo
        2026.
      </p>
      <Group.Grid>
        {groupedTeams()?.map(group => (
          <Group.Root key={group.group} title={group.group}>
            {group.teams.map(team => (
              <li key={team.id}>
                <Button
                  variant={'ghost'}
                  className={
                    'w-full justify-start px-0 transition-all hover:pl-2 cursor-pointer'
                  }
                  onClick={() => handleOpenFavoriteTeamDialog(team)}
                >
                  <Group.Team team={team} />
                </Button>
              </li>
            ))}
          </Group.Root>
        ))}
      </Group.Grid>
      <FavoriteTeamToChampion
        open={open}
        onOpenChange={handleFavoriteTeamDialogOpenChange}
        team={selectedTeam}
      />
    </section>
  )
}

const favoriteTeamSchema = z.object({
  teamId: z.string().uuid(),
})
type FavoriteTeamFormData = z.infer<typeof favoriteTeamSchema>

type FavoriteTeamToChampionProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  team: ITeam | null
  className?: string
}

export function FavoriteTeamToChampion({
  team,
  open,
  onOpenChange: setOpen,
  className,
}: FavoriteTeamToChampionProps) {
  const form = useForm<FavoriteTeamFormData>({
    resolver: zodResolver(favoriteTeamSchema),
    defaultValues: {
      teamId: undefined,
    },
  })

  const userId = getStorageAuth()!.id

  const mutation = useUpdatePalpiteCampeao(userId)

  useEffect(() => {
    if (team) {
      form.setValue('teamId', team.id)
    }
  }, [form, team])

  async function onSubmit(data: FavoriteTeamFormData) {
    try {
      const res = await mutation.mutateAsync(data.teamId)
      if (res) {
        toast.success('Palpite salvo com sucesso!')
      }
      setOpen(false)
    } catch (error) {
      ErrorResponseApi(error)
    }
  }

  const flagCode = team?.flag_icon
    ? getCountryCodeFromEmoji(team.flag_icon)
    : null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={cn(
          'w-full h-fit max-w-[calc(100vw-2rem)] max-h-[calc(100vh-4rem)] sm:max-w-lg overflow-y-scroll',
          className
        )}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-center sm:text-left">
                Palpite do Campeão
              </DialogTitle>
              <DialogDescription className="text-center sm:text-left">
                Você poderá alterar esse palpite até 1h antes da Final.
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-xl border bg-muted/20 p-3 sm:p-4">
              <div className="flex flex-col items-center gap-3 sm:gap-4">
                <Badge
                  className="max-w-full truncate uppercase text-xs tracking-widest bg-primary/10 text-primary"
                  variant={'secondary'}
                >
                  {team?.name}
                </Badge>

                <div className="relative aspect-video w-44 overflow-hidden rounded-md ring-1 ring-border sm:w-56">
                  <img
                    className="absolute h-full w-full object-cover"
                    src={
                      flagCode
                        ? `/country-flags/${flagCode}.webp`
                        : imagesUrl.flagPlaceholder.url
                    }
                    alt={team?.name}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border p-3 sm:p-4">
              <h3 className="mb-3 text-sm font-semibold text-foreground">
                Informacoes da selecao
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3 rounded-md bg-muted/30 px-3 py-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    Grupo
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    Grupo {team?.group}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-md bg-muted/30 px-3 py-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    Federacao
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {team?.confed}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-md bg-muted/30 px-3 py-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    Continente
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {team?.continent}
                  </span>
                </div>
              </div>
            </div>

            <DialogFooter className="w-full flex flex-col-reverse justify-center items-center gap-2 sm:flex-row">
              <Button
                type="submit"
                className={'h-10 w-full sm:h-11 sm:flex-1'}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? 'Salvando...' : 'Salvar palpite'}
              </Button>
              <DialogClose
                render={
                  <Button
                    type="button"
                    variant={'outline'}
                    className={'h-10 w-full sm:h-11 sm:flex-1'}
                  />
                }
              >
                Cancelar
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
