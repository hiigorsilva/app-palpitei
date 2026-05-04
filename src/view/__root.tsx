import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Toaster } from 'sonner'
import { Container } from '@/components/container'

export const Route = createRootRoute({
  component: RootLayout,
  head: () => ({
    meta: [
      {
        title: 'Palpitei | Bolão Copa do Mundo 2026',
        content: 'Bolão da tropa',
      },
    ],
  }),
})

function RootLayout() {
  return (
    <Container>
      <Outlet />
      <Toaster richColors theme="light" position="top-right" />
      <TanStackRouterDevtools />
    </Container>
  )
}
