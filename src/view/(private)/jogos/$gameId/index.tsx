import { createFileRoute } from '@tanstack/react-router'
import { useGetGameId } from '@/services/games/query'

export const Route = createFileRoute('/(private)/jogos/$gameId/')({
  component: GameIdPage,
  head: () => ({
    meta: [
      {
        title: 'Jogo | Palpitei',
      },
    ],
  }),
})

function GameIdPage() {
  const { gameId } = Route.useParams()

  const game = useGetGameId(gameId)
  if (game.isLoading) return <p>Loading...</p>
  if (game.isError || !game.data) return <p>Not Found</p>

  return (
    <h1>
      {game.data.team_a} x {game.data.team_b}
    </h1>
  )
}
