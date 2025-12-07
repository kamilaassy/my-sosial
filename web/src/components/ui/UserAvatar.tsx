import { Avatar } from '@mantine/core'

export const UserAvatar = ({ name, size = 40 }) => {
  return (
    <Avatar
      radius="xl"
      size={size}
      color="purplelux"
      variant="gradient"
      gradient={{ from: 'purplelux.3', to: 'purplelux.5', deg: 180 }}
      style={{
        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
      }}
    >
      {name?.[0]?.toUpperCase()}
    </Avatar>
  )
}
