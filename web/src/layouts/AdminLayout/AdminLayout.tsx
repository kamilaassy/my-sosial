import { AppShell, Group, Text, ActionIcon } from '@mantine/core'
import { useMantineColorScheme } from '@mantine/core'
import { IconSun, IconMoon } from '@tabler/icons-react'

import { useAuth } from 'src/auth'

export default function AdminLayout({ children }) {
  const { currentUser } = useAuth()
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const dark = colorScheme === 'dark'

  if (currentUser?.role !== 'admin') {
    return <Text ta="center">Access Denied</Text>
  }

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header
        style={{
          background: dark ? 'rgba(20,20,28,0.55)' : 'rgba(255,255,255,0.65)',

          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',

          borderBottom: dark
            ? '1px solid rgba(255,255,255,0.08)'
            : '1px solid rgba(0,0,0,0.08)',
        }}
      >
        <Group h="100%" px="md" justify="space-between">
          <Text fw={700}>Admin Panel</Text>

          <ActionIcon variant="subtle" onClick={toggleColorScheme}>
            {dark ? <IconSun size={20} /> : <IconMoon size={20} />}
          </ActionIcon>
        </Group>
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  )
}
