import {
  Group,
  Text,
  ActionIcon,
  Box,
  useMantineTheme,
  useMantineColorScheme,
} from '@mantine/core'
import { IconHeart } from '@tabler/icons-react'

import { GlassCard } from './GlassCard'

export const CommentCard = ({ username, content, liked, likes, onLike }) => {
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'

  const textMain = isDark
    ? theme.colors.purplelux[0]
    : theme.colors.purplelux[9]

  const textSubtle = isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)'

  const glassSoft = isDark ? 'rgba(8,8,12,0.32)' : 'rgba(255,255,255,0.18)'

  return (
    <GlassCard padding="md" mb="sm">
      {/* HEADER */}
      <Group mb={6} gap="xs">
        {/* Avatar mini */}
        <Box
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: glassSoft,
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 13,
            color: theme.colors.purplelux[6],
          }}
        >
          {username?.[0]?.toUpperCase()}
        </Box>

        <Text fw={600} size="sm" c={textMain}>
          {username}
        </Text>
      </Group>

      {/* CONTENT */}
      <Text
        size="sm"
        mb={6}
        c={textSubtle}
        style={{ lineHeight: 1.5, whiteSpace: 'pre-wrap' }}
      >
        {content}
      </Text>

      {/* ACTION */}
      <Group gap={6}>
        <ActionIcon
          variant="transparent"
          onClick={onLike}
          style={{
            transition: 'transform 0.15s ease, opacity 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.15)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          <IconHeart
            size={14}
            fill={liked ? '#ff4d4f' : 'none'}
            color={liked ? '#ff4d4f' : textMain}
          />
        </ActionIcon>

        <Text size="xs" c={textSubtle}>
          {likes}
        </Text>
      </Group>
    </GlassCard>
  )
}
