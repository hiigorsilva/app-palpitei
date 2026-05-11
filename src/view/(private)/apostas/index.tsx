import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(private)/apostas/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(private)/apostas/"!</div>
}
