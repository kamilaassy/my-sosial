import { Group, Text, ActionIcon } from '@mantine/core'
import { IconHeart } from '@tabler/icons-react'

import { Card } from './Card'

export const CommentCard = ({
  username,
  content,
  liked,
  likes,
  onLike,
  children,
}) => {
  return (
    <Card p="md" mb="sm">
      <Group mb="xs" gap="xs">
        {/* Avatar bulat */}
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'var(--mantine-color-purplelux-2)',
          }}
        />
        <Text fw={600} size="sm" c="purplelux.5">
          {username}
        </Text>
      </Group>

      <Text size="sm" mb="xs" c="purplelux.6">
        {content}
      </Text>

      <Group gap={4}>
        <ActionIcon
          radius="xl"
          variant={liked ? 'filled' : 'light'}
          color="purplelux"
          onClick={onLike}
        >
          <IconHeart size={16} />
        </ActionIcon>
        <Text c="purplelux.5">{likes}</Text>
      </Group>

      {children}
    </Card>
  )
}
