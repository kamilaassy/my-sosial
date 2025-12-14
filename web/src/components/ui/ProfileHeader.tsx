import {
  Group,
  Text,
  useMantineTheme,
  useComputedColorScheme,
} from '@mantine/core'

import { GlassCard } from './GlassCard'
import { UserAvatar } from './UserAvatar'

type ProfileHeaderProps = {
  username: string
  name?: string | null
  bio?: string | null
  avatarUrl?: string | null
  mb?: number
  rightSection?: React.ReactNode
}

export const ProfileHeader = ({
  username,
  name,
  bio,
  avatarUrl,
  mb = 0,
  rightSection = null,
}: ProfileHeaderProps) => {
  const theme = useMantineTheme()
  const isDark = useComputedColorScheme() === 'dark'

  return (
    <GlassCard padding="lg" radius="lg" mb={mb}>
      <Group align="flex-start" justify="space-between">
        {/* LEFT: Avatar + text */}
        <Group align="center">
          <UserAvatar name={name || username} src={avatarUrl} size={70} />

          <div>
            {/* Username (email) besar */}
            <Text
              fw={700}
              fz={24}
              c={isDark ? theme.colors.purplelux[0] : theme.colors.purplelux[9]}
            >
              {username}
            </Text>

            {/* Name kecil */}
            {name && (
              <Text
                size="sm"
                fw={500}
                c={
                  isDark ? theme.colors.purplelux[2] : theme.colors.purplelux[6]
                }
                mt={2}
              >
                {name}
              </Text>
            )}

            {/* Bio */}
            {bio && (
              <Text
                size="sm"
                mt={6}
                c={
                  isDark ? theme.colors.purplelux[2] : theme.colors.purplelux[6]
                }
              >
                {bio}
              </Text>
            )}
          </div>
        </Group>

        {/* RIGHT: More menu */}
        {rightSection && <div>{rightSection}</div>}
      </Group>
    </GlassCard>
  )
}
