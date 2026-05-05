import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(public)')({
  component: PublicLayout,
})

function PublicLayout() {
  return (
    <div className="w-full min-h-dvh flex flex-col">
      <Outlet />
    </div>
  )
}
