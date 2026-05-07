import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(private)/')({
  component: HomePage,
  head: () => ({
    meta: [
      {
        title: 'Palpitei | Bolão Copa do Mundo 2026',
      },
    ],
  }),
})

function HomePage() {
  return <h1>Conteudo</h1>
}
