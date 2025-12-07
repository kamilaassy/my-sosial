import { Container, useMantineColorScheme } from '@mantine/core'

export const AuthLayout = ({ children }) => {
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'

  const background = isDark
    ? 'linear-gradient(135deg, var(--mantine-color-purplelux-8), var(--mantine-color-purplelux-9))'
    : 'linear-gradient(135deg, var(--mantine-color-purplelux-1), var(--mantine-color-purplelux-3))'

  return (
    <div
      style={{
        minHeight: '100vh',
        background,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        transition: 'background 0.4s ease',
      }}
    >
      <Container size="xs">{children}</Container>
    </div>
  )
}
