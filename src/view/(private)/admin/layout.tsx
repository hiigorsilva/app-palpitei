import { createFileRoute, Outlet } from '@tanstack/react-router'
import { getStorageAdminAuth } from '@/helpers/auth'

export const Route = createFileRoute('/(private)/admin')({
  component: AdminRoot,
  beforeLoad: () => {
    if (!getStorageAdminAuth()) {
    }
  },
})

function AdminRoot() {
  return <Outlet />
}
