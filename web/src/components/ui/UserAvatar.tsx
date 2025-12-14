import { Avatar } from '@mantine/core'

type UserAvatarProps = {
  name: string
  src?: string | null
  size?: number
}

export const UserAvatar = ({ name, src, size = 40 }: UserAvatarProps) => {
  const fallback = name?.[0]?.toUpperCase() || '?'

  return (
    <Avatar
      radius="xl"
      size={size}
      src={src || undefined}
      color="purplelux"
      variant={src ? 'filled' : 'gradient'}
      gradient={{ from: 'purplelux.3', to: 'purplelux.5', deg: 180 }}
      style={{
        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
      }}
    >
      {!src && fallback}
    </Avatar>
  )
}
