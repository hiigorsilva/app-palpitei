import { createFileRoute } from '@tanstack/react-router'
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
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Classificação por Grupos</h1>

      <Group.Grid>
        {groupedTeams()?.map(group => (
          <Group.Root key={group.group} title={group.group}>
            {group.teams.map(team => (
              <Group.Team key={team.id} name={team.name} logo={team.logo} />
            ))}
          </Group.Root>
        ))}
      </Group.Grid>
    </div>
  )
}
