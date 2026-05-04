import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(private)')({
  component: PrivateLayout,
})

function PrivateLayout() {
  return <Outlet />
}
