import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute } from '@tanstack/react-router'
import { ArrowLeftIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { TitleContainer } from '@/components/title-container'
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
import { flagPlaceholder } from '@/helpers/placeholders'
import { getCountryCodeFromEmoji } from '@/helpers/strings'
import { cn } from '@/lib/utils'
import { useListGrupos } from '@/services/grupos/query'
import type { IGrupo } from '@/services/grupos/type'
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
  const [selectedTeam, setSelectedTeam] = useState<IGrupo | null>(null)

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
      [] as { group: string; teams: IGrupo[] }[]
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

  function handleOpenFavoriteTeamDialog(team: IGrupo) {
    setSelectedTeam(team)
    setOpen(true)
  }

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
        Grupos e Seleções
      </TitleContainer>
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
  team: IGrupo | null
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

  useEffect(() => {
    if (team) {
      form.setValue('teamId', team.id)
    }
  }, [form, team])

  function onSubmit(data: FavoriteTeamFormData) {
    const payload: Pick<FavoriteTeamFormData, 'teamId'> = {
      teamId: data.teamId,
    }

    console.log('submit aposta', payload)
    setOpen(false)
  }

  const flagCode = team?.flag_icon
    ? getCountryCodeFromEmoji(team.flag_icon)
    : null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className={cn('', className)}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Confirme seu Palpite</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja apostar em{' '}
                <strong className="font-semibold text-primary">
                  {team?.name}
                </strong>{' '}
                para ganhar a Copa do Mundo?
              </DialogDescription>

              <div className="flex justify-center items-center py-3">
                <div className="relative aspect-video w-3/4 h-auto overflow-hidden rounded-md">
                  <img
                    className="absolute object-contain w-full h-full rounded-md overflow-hidden"
                    src={
                      flagCode
                        ? `/country-flags/${flagCode}.webp`
                        : flagPlaceholder
                    }
                    alt={team?.name}
                  />
                </div>
              </div>

              <DialogFooter className="w-full flex justify-center items-center">
                <Button type="submit" className={'flex-1'}>
                  Salvar palpite
                </Button>
                <DialogClose
                  render={
                    <Button
                      type="button"
                      variant={'outline'}
                      className={'flex-1'}
                    />
                  }
                >
                  Cancelar
                </DialogClose>
              </DialogFooter>
            </DialogHeader>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
