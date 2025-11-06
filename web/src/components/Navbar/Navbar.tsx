import {
  Group,
  Title,
  TextInput,
  ActionIcon,
  Avatar,
  AppShell,
  useMantineColorScheme,
} from '@mantine/core'
import {
  IconSearch,
  IconBell,
  IconUser,
  IconSun,
  IconMoon,
} from '@tabler/icons-react'

export default function Navbar() {
  const { colorScheme, setColorScheme } = useMantineColorScheme()
  const dark = colorScheme === 'dark'

  return (
    <AppShell.Header
      withBorder
      style={{
        backgroundColor: dark ? '#1A1B1E' : 'white',
        padding: '0 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* Kiri - Judul Aplikasi */}
      <Title order={3} c={dark ? 'gray.2' : 'blue'}>
        EFVN
      </Title>

      {/* Tengah - Search bar */}
      <TextInput
        placeholder="Search..."
        leftSection={<IconSearch size={16} />}
        radius="md"
        size="sm"
        w={250}
        styles={{
          input: {
            backgroundColor: dark ? '#2C2E33' : '#f1f3f5',
            color: dark ? '#fff' : '#000',
          },
        }}
      />

      {/* Kanan - Icon notifikasi, toggle tema, dan avatar */}
      <Group>
        <ActionIcon variant="subtle" color="blue">
          <IconBell size={20} />
        </ActionIcon>

        {/* Tombol toggle dark/light */}
        <ActionIcon
          onClick={() => setColorScheme(dark ? 'light' : 'dark')}
          variant="subtle"
          color={dark ? 'yellow' : 'blue'}
          title="Change color scheme"
        >
          {dark ? <IconSun size={20} /> : <IconMoon size={20} />}
        </ActionIcon>

        <Avatar radius="xl" color="blue">
          <IconUser size={16} />
        </Avatar>
      </Group>
    </AppShell.Header>
  )
}
