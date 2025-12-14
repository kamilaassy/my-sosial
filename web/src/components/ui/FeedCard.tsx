import {
  Group,
  Text,
  ActionIcon,
  Menu,
  Image,
  Box,
  useMantineTheme,
  useMantineColorScheme,
} from '@mantine/core'
import {
  IconDots,
  IconHeart,
  IconMessageCircle,
  IconPencil,
  IconTrash,
} from '@tabler/icons-react'
import { formatDistanceToNow } from 'date-fns'

import { navigate, routes } from '@redwoodjs/router'

import { GlassCard } from 'src/components/ui/GlassCard'
import { getLowResPlaceholder } from 'src/lib/image'

export const FeedCard = ({
  userId,
  username,
  avatarUrl,
  content,
  imageUrl,
  createdAt,
  likes,
  isLiked,
  comments,
  onLike,
  onComment,
  onEdit,
  onDelete,
  isOwner,
  mb = 20,
}) => {
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'

  const textMain = isDark
    ? theme.colors.purplelux[0]
    : theme.colors.purplelux[9]

  const textSubtle = isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)'

  const glassSoft = isDark ? 'rgba(8,8,12,0.32)' : 'rgba(255,255,255,0.18)'

  return (
    <GlassCard mb={mb}>
      {/* HEADER */}
      <Group justify="space-between" align="flex-start" mb="sm">
        <Group>
          <Box
            onClick={() => navigate(routes.profile({ id: userId }))}
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              overflow: 'hidden',
              cursor: 'pointer',
              background: glassSoft,
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              color: theme.colors.purplelux[6],
            }}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt=""
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              username?.[0]?.toUpperCase()
            )}
          </Box>

          <Box>
            <Text
              fw={700}
              c={textMain}
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(routes.profile({ id: userId }))}
            >
              {username}
            </Text>

            <Text size="xs" c={textSubtle}>
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </Text>
          </Box>
        </Group>

        {isOwner && (
          <Menu withinPortal width={160}>
            <Menu.Target>
              <ActionIcon
                radius="xl"
                size="lg"
                style={{
                  background: glassSoft,
                  backdropFilter: 'blur(12px)',
                }}
              >
                <IconDots size={18} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconPencil size={16} />}
                onClick={onEdit}
              >
                Edit
              </Menu.Item>
              <Menu.Item
                leftSection={<IconTrash size={16} />}
                color="red"
                onClick={() => onDelete?.()}
              >
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </Group>

      {/* CONTENT */}
      {content && (
        <Text
          mb="sm"
          c={textMain}
          style={{ lineHeight: 1.6, whiteSpace: 'pre-wrap' }}
        >
          {content}
        </Text>
      )}

      {/* IMAGE */}
      {imageUrl && (
        <Box
          mt="sm"
          style={{
            borderRadius: 16,
            overflow: 'hidden',
            backgroundImage: `url(${getLowResPlaceholder(imageUrl)})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <Image src={imageUrl} loading="lazy" fit="cover" />
        </Box>
      )}

      {/* ACTIONS */}
      <Group gap="lg" mt="md">
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
              size={18}
              fill={isLiked ? '#ff4d4f' : 'none'}
              color={isLiked ? '#ff4d4f' : 'currentColor'}
            />
          </ActionIcon>

          <Text size="sm" c={textSubtle}>
            {likes}
          </Text>
        </Group>

        <Group gap={6}>
          <ActionIcon
            variant="transparent"
            onClick={onComment}
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
            <IconMessageCircle size={18} />
          </ActionIcon>

          <Text size="sm" c={textSubtle}>
            {comments}
          </Text>
        </Group>
      </Group>
    </GlassCard>
  )
}
