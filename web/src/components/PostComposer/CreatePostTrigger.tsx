import { Card, Group, Avatar, Text } from '@mantine/core'

import { useAuth } from 'src/auth'

import { usePostComposer } from './PostComposerContext'

type Props = {
  onClick?: () => void
}

export default function CreatePostTrigger({ onClick }: Props) {
  const { open } = usePostComposer()
  const { currentUser } = useAuth()

  // Jika Feed memberi onClick, gunakan itu.
  // Jika tidak, pakai open() default.
  const handleClick = () => {
    if (onClick) onClick()
    else open()
  }

  return (
    <Card
      radius="xl"
      withBorder
      onClick={handleClick}
      style={{
        cursor: 'pointer',
        maxWidth: 680,
        margin: '0 auto',
        marginBottom: 20,
        padding: '14px 18px',
      }}
    >
      <Group>
        <Avatar
          src={(currentUser?.avatarUrl as string | undefined) || undefined}
          radius="xl"
          size={40}
        />

        <Text c="dimmed" style={{ fontSize: 16 }}>
          What’s on your mind?
        </Text>
      </Group>
    </Card>
  )
}
