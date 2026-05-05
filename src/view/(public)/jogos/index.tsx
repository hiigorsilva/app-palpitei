import { createFileRoute } from '@tanstack/react-router'
import { useListGames } from '@/services/games/query'

export const Route = createFileRoute('/(public)/jogos/')({
  component: GamesPage,
})

function GamesPage() {
  const games = useListGames({ fase: 'GRUPOS', status: 'FUTURO' })
  return (
    <ul>
      {games.data?.map(item => (
        <li key={item.id}>
          {item.team_a} vs {item.team_b}
        </li>
      ))}
    </ul>
  )
}
