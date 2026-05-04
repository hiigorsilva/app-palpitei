import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(private)/')({
  component: HomePage,
})

function HomePage() {
  return <>Olá</>
}
