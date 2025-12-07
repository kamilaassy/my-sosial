import { Button, useMantineColorScheme } from '@mantine/core'

export const FollowButton = ({
  following = false,
  onToggle,
  fullWidth = true,
  ...props
}) => {
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'

  return (
    <Button
      fullWidth={fullWidth}
      radius="xl"
      size="md"
      fw={600}
      onClick={onToggle}
      style={{
        background: following
          ? isDark
            ? `linear-gradient(135deg, var(--mantine-color-purplelux-7), var(--mantine-color-purplelux-5))`
            : `linear-gradient(135deg, var(--mantine-color-purplelux-5), var(--mantine-color-purplelux-3))`
          : isDark
            ? `linear-gradient(135deg, var(--mantine-color-purplelux-8), var(--mantine-color-purplelux-6))`
            : `linear-gradient(135deg, var(--mantine-color-purplelux-1), var(--mantine-color-purplelux-3))`,
        color: 'white',
      }}
      {...props}
    >
      {following ? 'Unfollow' : 'Follow'}
    </Button>
  )
}
