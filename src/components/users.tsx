import { type ComponentProps, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { IUser } from '@/services/users/type'
import { Button } from './ui/button'
import { UserDetailsCard } from './user-card-item'

type UsersProps = ComponentProps<'div'> & {
  users: IUser[]
  positionsByUserId?: Map<string, number>
}

export function Users({
  users,
  positionsByUserId,
  className,
  ...props
}: UsersProps) {
  const [openUserCard, setOpenUserCard] = useState(false)
  const [selectedParticipant, setSelectedParticipant] = useState<{
    user: IUser
    position: number
  } | null>(null)

  const size = '96x96'
  const randomColor = 'random'
  const textColor = 'fff'

  return (
    <Card
      className={cn('flex flex-col gap-2 bg-transparent p-3', className)}
      {...props}
    >
      {users.map((user, index) => {
        const position = positionsByUserId?.get(user.id) ?? index + 1

        return (
          <Button
            key={user.id}
            variant="outline"
            className="min-w-full w-fit h-fit flex justify-start items-center gap-3 p-3 cursor-pointer"
            onClick={() => {
              setSelectedParticipant({ user, position })
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
        )
      })}
      {selectedParticipant && (
        <UserDetailsCard
          onOpenChange={setOpenUserCard}
          open={openUserCard}
          position={selectedParticipant.position}
          user={selectedParticipant.user}
        />
      )}
    </Card>
  )
}
