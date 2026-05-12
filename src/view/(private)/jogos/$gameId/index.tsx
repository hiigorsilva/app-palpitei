import { createFileRoute } from '@tanstack/react-router'
import { ArrowLeftIcon } from 'lucide-react'
import { NextGames } from '@/components/next-games'
import { TitleContainer } from '@/components/title-container'
import { Button } from '@/components/ui/button'
import { useGetGameId, useNextGames } from '@/services/games/query'
import { DisplayGame } from './-components/display-game'

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
  const navigate = Route.useNavigate()

  const game = useGetGameId(gameId)
  const nextGames = useNextGames()

  if (game.isLoading) return <p>Loading...</p>
  if (nextGames.isLoading) return <p>Loading...</p>

  if (nextGames.isError || !nextGames.data) return <p>Not Found</p>
  if (game.isError || !game.data) return <p>Not Found</p>

  function handleBackNavigate() {
    navigate({ to: '../..' })
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
        Detalhes da partida
      </TitleContainer>
      <DisplayGame game={game.data} />
      <div className="min-w-0 w-full">
        <NextGames nextGames={nextGames.data} />
      </div>
    </section>
  )
}
