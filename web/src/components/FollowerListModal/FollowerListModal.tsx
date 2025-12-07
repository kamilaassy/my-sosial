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

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      size="lg"
      radius="md"
      withCloseButton
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      styles={{
        content: {
          backgroundColor: isDark
            ? theme.colors.purplelux[9]
            : theme.colors.purplelux[1],
          border: `1px solid ${
            isDark ? theme.colors.purplelux[7] : theme.colors.purplelux[3]
          }`,
        },
        header: {
          backgroundColor: isDark
            ? theme.colors.purplelux[9]
            : theme.colors.purplelux[1],
          borderBottom: `1px solid ${
            isDark ? theme.colors.purplelux[7] : theme.colors.purplelux[3]
          }`,
        },
        title: {
          color: isDark ? theme.colors.purplelux[0] : theme.colors.purplelux[8],
          fontWeight: 700,
        },
      }}
    >
      <ScrollArea h={400}>
        {users.map((u) => (
          <Box
            key={u.id}
            p="sm"
            mb="sm"
            style={{
              borderRadius: 10,
              cursor: 'pointer',
              backgroundColor: isDark
                ? theme.colors.purplelux[8]
                : theme.colors.purplelux[0],
              border: `1px solid ${
                isDark ? theme.colors.purplelux[7] : theme.colors.purplelux[2]
              }`,
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
