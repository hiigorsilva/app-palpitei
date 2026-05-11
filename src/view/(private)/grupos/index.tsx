import { createFileRoute } from '@tanstack/react-router'
import { TitleContainer } from '@/components/title-container'
import { useListGrupos } from '@/services/grupos/query'
import type { IGrupo } from '@/services/grupos/type'
import { Group } from './-components/grid-teams'

export const Route = createFileRoute('/(private)/grupos/')({
  component: GruposPage,
})

function GruposPage() {
  const grupos = useListGrupos()

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

  return (
    <section className="flex flex-col gap-6">
      <TitleContainer>Classificação por Grupos</TitleContainer>
      <Group.Grid>
        {groupedTeams()?.map(group => (
          <Group.Root key={group.group} title={group.group}>
            {group.teams.map(team => (
              <Group.Team key={team.id} name={team.name} logo={team.logo} />
            ))}
          </Group.Root>
        ))}
      </Group.Grid>
    </section>
  )
}
