import {
  Box,
  ScrollArea,
  Text,
  Group,
  Avatar,
  useComputedColorScheme,
  useMantineTheme,
} from '@mantine/core'

type NotificationItem = {
  id: number
  type: 'LIKE' | 'COMMENT' | 'FOLLOW'
  createdAt: string
  postId?: number
  fromUser: {
    name?: string
    email: string
    avatarUrl?: string
  }
}

type Props = {
  notifications: NotificationItem[]
  onClose: () => void
}

export default function NotificationsPanel({ notifications, onClose }: Props) {
  const theme = useMantineTheme()
  const scheme = useComputedColorScheme()
  const isDark = scheme === 'dark'

  const bg = isDark ? theme.colors.purplelux[9] : theme.colors.purplelux[1]
  const cardBg = isDark ? theme.colors.purplelux[8] : theme.colors.purplelux[0]
  const border = isDark ? theme.colors.purplelux[7] : theme.colors.purplelux[3]

  return (
    <Box
      style={{
        width: 380,
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 500,
        backgroundColor: bg,
        borderRight: `1px solid ${border}`,
        boxShadow: '2px 0 10px rgba(0,0,0,0.18)',
        display: 'flex',
        flexDirection: 'column',
        transform: 'translateX(0)',
        transition: 'transform 0.3s ease',
      }}
    >
      {/* HEADER */}
      <Group
        justify="space-between"
        p="md"
        style={{
          borderBottom: `1px solid ${border}`,
          backgroundColor: bg,
        }}
      >
        <Text fw={700} size="xl">
          Notifications
        </Text>

        <Text
          size="sm"
          fw={500}
          style={{ cursor: 'pointer' }}
          onClick={onClose}
        >
          Close
        </Text>
      </Group>

      {/* LIST */}
      <ScrollArea style={{ flex: 1 }}>
        <Box p="md">
          {notifications.length === 0 && (
            <Text size="sm" c="dimmed" ta="center" mt="lg">
              No notifications yet
            </Text>
          )}

          {notifications.map((n) => (
            <Group
              key={n.id}
              align="flex-start"
              p="sm"
              mb="sm"
              style={{
                backgroundColor: cardBg,
                borderRadius: 12,
                border: `1px solid ${border}`,
                cursor: 'pointer',
                transition: '0.15s ease',
              }}
              onClick={() => {
                if (n.postId) {
                  window.dispatchEvent(
                    new CustomEvent('open-post-modal', {
                      detail: { postId: n.postId },
                    })
                  )
                  onClose()
                }
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.backgroundColor = isDark
                  ? theme.colors.purplelux[7]
                  : theme.colors.purplelux[2]
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.backgroundColor = cardBg
              }}
            >
              <Avatar
                src={n.fromUser.avatarUrl || undefined}
                radius="xl"
                size="lg"
              />

              <Box>
                <Text fw={600} size="sm">
                  {n.fromUser.name || n.fromUser.email}
                </Text>

                <Text size="sm">
                  {n.type === 'LIKE' && 'liked your post'}
                  {n.type === 'COMMENT' && 'commented on your post'}
                  {n.type === 'FOLLOW' && 'followed you'}
                </Text>

                <Text size="xs" c="dimmed" mt={2}>
                  {new Date(n.createdAt).toLocaleString()}
                </Text>
              </Box>
            </Group>
          ))}
        </Box>
      </ScrollArea>
    </Box>
  )
}
