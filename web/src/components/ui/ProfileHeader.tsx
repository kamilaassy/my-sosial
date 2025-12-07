import {
  Group,
  Text,
  useMantineTheme,
  useComputedColorScheme,
} from '@mantine/core'

import { Card } from './Card'
import { UserAvatar } from './UserAvatar'

export const ProfileHeader = ({ name, bio, mb = 0, rightSection = null }) => {
  const theme = useMantineTheme()
  const colorScheme = useComputedColorScheme()
  const isDark = colorScheme === 'dark'

  return (
    <Card p="lg" radius="lg" mb={mb} withBorder>
      <Group align="flex-start" justify="space-between">
        {/* Left side: Avatar + name + bio */}
        <Group align="center">
          <UserAvatar name={name} size={70} />

          <div>
            <Text
              fw={700}
              c={isDark ? theme.colors.purplelux[0] : theme.colors.purplelux[9]}
            >
              {name}
            </Text>

            {bio && (
              <Text
                size="sm"
                mt={4}
                c={
                  isDark ? theme.colors.purplelux[2] : theme.colors.purplelux[6]
                }
              >
                {bio}
              </Text>
            )}
          </div>
        </Group>

        {/* Right side: 3 dots menu */}
        {rightSection && <div>{rightSection}</div>}
      </Group>
    </Card>
  )
}
