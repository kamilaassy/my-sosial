import { Paper, useMantineTheme, useComputedColorScheme } from '@mantine/core'

export const Card = ({ children, ...props }) => {
  const theme = useMantineTheme()
  const colorScheme = useComputedColorScheme() // Mantine v7 way
  const isDark = colorScheme === 'dark'

  return (
    <Paper
      radius="lg"
      shadow="md"
      withBorder
      bg={isDark ? theme.colors.purplelux[9] : theme.colors.purplelux[0]}
      style={{
        borderColor: isDark
          ? theme.colors.purplelux[6]
          : theme.colors.purplelux[2],
        color: isDark ? theme.colors.purplelux[0] : theme.colors.purplelux[8],
      }}
      {...props}
    >
      {children}
    </Paper>
  )
}
