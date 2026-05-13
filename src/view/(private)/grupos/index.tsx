import { createFileRoute } from '@tanstack/react-router'
import { ArrowLeftIcon } from 'lucide-react'
import { TitleContainer } from '@/components/title-container'
import { Button } from '@/components/ui/button'
import { getStorageAuth } from '@/helpers/auth'
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
              <Group.Team key={team.id} team={team} />
            ))}
          </Group.Root>
        ))}
      </Group.Grid>
    </section>
  )
}
