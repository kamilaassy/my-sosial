import {
  Modal,
  Box,
  Group,
  Text,
  Avatar,
  ScrollArea,
  useMantineTheme,
  useComputedColorScheme,
} from '@mantine/core'

export default function FollowerListModal({ opened, onClose, title, users }) {
  const theme = useMantineTheme()
  const isDark = useComputedColorScheme() === 'dark'

  const glassBg = isDark ? 'rgba(20, 20, 28, 0.6)' : 'rgba(255, 255, 255, 0.65)'

  const glassBorder = isDark
    ? '1px solid rgba(255,255,255,0.12)'
    : '1px solid rgba(0,0,0,0.08)'

  const itemHover = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      size="lg"
      radius="lg"
      centered
      overlayProps={{
        backgroundOpacity: 0.45,
        blur: 8,
      }}
      styles={{
        content: {
          background: glassBg,
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          border: glassBorder,
        },
        header: {
          background: 'transparent',
          borderBottom: glassBorder,
        },
        title: {
          fontWeight: 700,
          color: isDark ? theme.colors.purplelux[0] : theme.colors.purplelux[9],
        },
        close: {
          color: isDark ? theme.colors.purplelux[2] : theme.colors.purplelux[7],
        },
      }}
    >
      <ScrollArea h={420} scrollbarSize={6}>
        {users.map((u) => (
          <Box
            key={u.id}
            p="sm"
            mb={8}
            style={{
              borderRadius: 12,
              cursor: 'pointer',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = itemHover
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            <Group>
              <Avatar src={u.avatarUrl || undefined} radius="xl" size="lg" />

              <Box>
                <Text fw={600}>{u.name || u.email}</Text>
                <Text size="sm" c="dimmed">
                  @{u.email}
                </Text>
              </Box>
            </Group>
          </Box>
        ))}
      </ScrollArea>
    </Modal>
  )
}
