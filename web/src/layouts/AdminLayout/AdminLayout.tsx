import { AppShell, Group, Text, ActionIcon } from '@mantine/core'
import { useMantineColorScheme } from '@mantine/core'
import { IconSun, IconMoon } from '@tabler/icons-react'

import { useAuth } from 'src/auth'

export default function AdminLayout({ children }) {
  const { currentUser } = useAuth()

  // BYPASS ROLE
  const isDevAdminBypass = process.env.NODE_ENV === 'development'

  if (!isDevAdminBypass && currentUser?.role !== 'admin') {
    return <div>Akses ditolak</div>
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { colorScheme, setColorScheme } = useMantineColorScheme()
  const dark = colorScheme === 'dark'

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header
        style={{
          background: dark
            ? 'var(--mantine-color-purplelux-9)'
            : 'var(--mantine-color-purplelux-1)',
          borderBottom: `1px solid var(--mantine-color-purplelux-4)`,
        }}
      >
        <Group h="100%" px="md" justify="space-between">
          <Text fw={700}>Admin Panel</Text>

          <ActionIcon
            variant="default"
            onClick={() => setColorScheme(dark ? 'light' : 'dark')}
          >
            {dark ? <IconSun size={20} /> : <IconMoon size={20} />}
          </ActionIcon>
        </Group>
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  )
}
