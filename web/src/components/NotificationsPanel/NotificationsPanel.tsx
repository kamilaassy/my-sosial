import {
  Box,
  ScrollArea,
  Text,
  Group,
  Avatar,
  Badge,
  ActionIcon,
  Button,
  useMantineTheme,
  useComputedColorScheme,
} from '@mantine/core'
import { IconCheck } from '@tabler/icons-react'

import { useQuery, useMutation } from '@redwoodjs/web'

import {
  GET_NOTIFICATIONS,
  MARK_READ,
  MARK_ALL_READ,
} from 'src/graphql/notifications'

export default function NotificationsPanel({ onClose }) {
  const theme = useMantineTheme()
  const scheme = useComputedColorScheme()
  const isDark = scheme === 'dark'

  const { data, loading, refetch } = useQuery(GET_NOTIFICATIONS)

  const [markRead] = useMutation(MARK_READ, {
    onCompleted: () => refetch(),
  })

  const [markAllRead] = useMutation(MARK_ALL_READ, {
    onCompleted: () => refetch(),
  })

  const notifications = data?.notifications || []

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
        }}
      >
        <Text fw={700} size="xl">
          Notifications
        </Text>

        <Group>
          {notifications.some((n) => !n.isRead) && (
            <Button
              size="xs"
              variant="light"
              onClick={() => markAllRead()}
              leftSection={<IconCheck size={14} />}
            >
              Mark all read
            </Button>
          )}

          <Text
            size="sm"
            fw={500}
            style={{ cursor: 'pointer' }}
            onClick={onClose}
          >
            Close
          </Text>
        </Group>
      </Group>

      {/* LIST */}
      <ScrollArea style={{ flex: 1 }}>
        <Box p="md">
          {loading && (
            <Text size="sm" c="dimmed">
              Loading...
            </Text>
          )}

          {!loading && notifications.length === 0 && (
            <Text size="sm" c="dimmed" ta="center" mt="lg">
              No notifications yet
            </Text>
          )}

          {notifications.map((n) => {
            const user = n.fromUser

            // label notif
            let label = ''
            let badgeColor: string = 'gray'

            if (n.type === 'LIKE') {
              label = 'liked your post'
              badgeColor = 'red'
            } else if (n.type === 'COMMENT') {
              label = 'commented on your post'
              badgeColor = 'green'
            } else if (n.type === 'FOLLOW') {
              label = 'followed you'
              badgeColor = 'blue'
            }

            return (
              <Group
                key={n.id}
                align="flex-start"
                p="sm"
                mb="sm"
                style={{
                  backgroundColor: n.isRead
                    ? cardBg
                    : isDark
                      ? theme.colors.purplelux[7]
                      : theme.colors.purplelux[2],
                  borderRadius: 12,
                  border: `1px solid ${border}`,
                  cursor: 'pointer',
                  transition: '0.15s ease',
                }}
                onClick={() => {
                  // kalau notif ada post → buka modal
                  if (n.postId) {
                    window.dispatchEvent(
                      new CustomEvent('open-post-modal', {
                        detail: { postId: n.postId },
                      })
                    )
                  }

                  // auto mark read
                  if (!n.isRead) markRead({ variables: { id: n.id } })
                  onClose()
                }}
              >
                <Avatar
                  src={user.avatarUrl || undefined}
                  radius="xl"
                  size="lg"
                />

                <Box style={{ flex: 1 }}>
                  <Group gap={8}>
                    <Badge size="xs" color={badgeColor}>
                      {n.type}
                    </Badge>

                    {!n.isRead && (
                      <Badge color="yellow" size="xs">
                        NEW
                      </Badge>
                    )}
                  </Group>

                  <Text fw={600} size="sm" mt={4}>
                    {user.name || user.email} {label}
                  </Text>

                  {n.commentText && (
                    <Text size="xs" c="dimmed">
                      “{n.commentText}”
                    </Text>
                  )}

                  <Text size="xs" c="dimmed" mt={4}>
                    {new Date(n.createdAt).toLocaleString()}
                  </Text>
                </Box>

                {/* Manual mark read */}
                {!n.isRead && (
                  <ActionIcon
                    size="sm"
                    variant="subtle"
                    onClick={(e) => {
                      e.stopPropagation()
                      markRead({ variables: { id: n.id } })
                    }}
                  >
                    <IconCheck size={16} />
                  </ActionIcon>
                )}
              </Group>
            )
          })}
        </Box>
      </ScrollArea>
    </Box>
  )
}
