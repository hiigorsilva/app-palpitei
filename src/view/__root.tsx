import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Toaster } from 'sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/contexts/auth'

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

export const queryClient = new QueryClient()

function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Outlet />
          <Toaster richColors theme="light" position="top-right" />
          <TanStackRouterDevtools />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
