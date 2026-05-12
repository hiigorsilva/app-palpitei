import { createFileRoute } from '@tanstack/react-router'
import { ArrowLeftIcon } from 'lucide-react'
import { TitleContainer } from '@/components/title-container'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getStorageAuth } from '@/helpers/auth'
import { useGetBetsByUserId } from '@/services/bets/query'
import { ApostaCardItem } from './-comoponents/aposta-card-item'

export const Route = createFileRoute('/(private)/apostas/')({
  component: ApostasPage,
})

function ApostasPage() {
  const navigate = Route.useNavigate()
  const user = getStorageAuth()
  if (!user) return null

  const bets = useGetBetsByUserId(user.id)

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
        Minhas Apostas
      </TitleContainer>

      <div className="grid grid-cols-3 gap-6">
        <ul className="col-span-1 w-full flex flex-col gap-6">
          {bets.data &&
            bets.data.length > 0 &&
            bets.data.map(bet => (
              <>
                <ApostaCardItem key={bet.id} bet={bet} />
                <ApostaCardItem key={bet.id} bet={bet} />
                <ApostaCardItem key={bet.id} bet={bet} />
                <ApostaCardItem key={bet.id} bet={bet} />
                <ApostaCardItem key={bet.id} bet={bet} />
                <ApostaCardItem key={bet.id} bet={bet} />
              </>
            ))}
        </ul>

        <Card className="col-span-2 w-full h-auto"></Card>
      </div>
    </section>
  )
}
