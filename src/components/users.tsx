import { type ComponentProps, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { IUser } from '@/services/users/type'
import { Button } from './ui/button'
import { UserDetailsCard } from './user-card-item'

type UsersProps = ComponentProps<'div'> & {
  users: IUser[]
}

export function Users({ users, className, ...props }: UsersProps) {
  const [openUserCard, setOpenUserCard] = useState(false)
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null)

  const size = '96x96'
  const randomColor = 'random'
  const textColor = 'fff'

  return (
    <Card className={className} {...props}>
      <CardHeader>
        <CardTitle>Participantes</CardTitle>
        <CardDescription>
          Lista de participantes do bolão da Copa do Mundo 2026.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {users.map(user => (
          <Button
            key={user.id}
            variant="outline"
            className="min-w-full w-fit h-fit flex justify-start items-center gap-3 p-3 cursor-pointer"
            onClick={() => {
              setSelectedUser(user)
              setOpenUserCard(true)
            }}
          >
            <Avatar>
              <AvatarImage
                src={`https://ui-avatars.com/api/?name=${user.name}&size=${size}&background=${randomColor}&color=${textColor}&length=2&uppercase=true&format=webp`}
              />
              <AvatarFallback>
                {user.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h3>{user.name}</h3>
          </Button>
        ))}
        <UserDetailsCard
          onOpenChange={setOpenUserCard}
          open={openUserCard}
          user={selectedUser}
        />
      </CardContent>
    </Card>
  )
}
