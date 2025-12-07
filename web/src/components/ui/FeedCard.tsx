import {
  Card,
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
  IconMessage,
  IconPencil,
  IconTrash,
} from '@tabler/icons-react'
import { formatDistanceToNow } from 'date-fns'

import { navigate, routes } from '@redwoodjs/router'

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
  mb = 16,
}) => {
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'

  // CARD LOOK
  const cardBg = isDark ? theme.colors.purplelux[9] : theme.colors.purplelux[0]
  const border = isDark ? theme.colors.purplelux[7] : theme.colors.purplelux[2]
  const softBg = isDark ? theme.colors.purplelux[7] : theme.colors.purplelux[1]

  const textColor = isDark
    ? theme.colors.purplelux[0]
    : theme.colors.purplelux[9]

  const subtleText = isDark ? 'purplelux.2' : 'purplelux.6'

  return (
    <Card
      radius="lg"
      shadow="md"
      p="lg"
      withBorder
      mb={mb}
      style={{
        backgroundColor: cardBg,
        border: `1px solid ${border}`,
        backdropFilter: 'blur(6px)',
      }}
    >
      {/* HEADER */}
      <Group justify="space-between" mb="sm">
        <Group>
          {/* AVATAR */}
          <Box
            onClick={() => navigate(routes.profile({ id: userId }))}
            style={{
              width: 42,
              height: 42,
              borderRadius: '50%',
              overflow: 'hidden',
              cursor: 'pointer',
              backgroundColor: softBg,
            }}
          >
            {avatarUrl && (
              <img
                src={avatarUrl}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}
          </Box>

          {/* USERNAME + TIME */}
          <div>
            <Text fw={700} c={textColor} style={{ cursor: 'pointer' }}>
              {username}
            </Text>

            <Text size="xs" c={subtleText}>
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </Text>
          </div>
        </Group>

        {/* MENU */}
        {isOwner && (
          <Menu
            shadow="md"
            width={150}
            styles={{
              dropdown: {
                backgroundColor: cardBg,
                border: `1px solid ${border}`,
              },
              item: {
                color: textColor,
                '&[data-hovered]': {
                  backgroundColor: softBg,
                },
              },
            }}
          >
            <Menu.Target>
              <ActionIcon
                radius="xl"
                size="lg"
                variant="filled"
                style={{
                  backgroundColor: softBg,
                }}
              >
                <IconDots
                  size={20}
                  color={
                    isDark
                      ? theme.colors.purplelux[1]
                      : theme.colors.purplelux[7]
                  }
                />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown
              style={{
                backgroundColor: isDark
                  ? theme.colors.purplelux[9]
                  : theme.colors.purplelux[1],
                border: `1px solid ${
                  isDark ? theme.colors.purplelux[7] : theme.colors.purplelux[2]
                }`,
              }}
            >
              <Menu.Item
                leftSection={<IconPencil size={16} />}
                style={{
                  color: textColor,
                }}
                onClick={onEdit}
              >
                Edit
              </Menu.Item>

              <Menu.Item
                leftSection={<IconTrash size={16} />}
                style={{
                  color: isDark ? theme.colors.red[4] : theme.colors.red[7],
                }}
                onClick={() => onDelete?.()}
              >
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </Group>

      {/* CONTENT */}
      <Text
        mb="sm"
        c={textColor}
        style={{
          lineHeight: 1.55,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {content}
      </Text>

      {/* IMAGE */}
      {imageUrl && (
        <Card.Section mb="sm">
          <Image src={imageUrl} radius="md" />
        </Card.Section>
      )}

      {/* ACTIONS */}
      <Group gap="md" mt="xs">
        {/* LIKE */}
        <Group gap={4}>
          <ActionIcon
            radius="xl"
            size="lg"
            variant="filled"
            onClick={onLike}
            style={{
              backgroundColor: isLiked ? theme.colors.purplelux[6] : softBg,
            }}
          >
            <IconHeart
              size={18}
              color={isLiked ? 'white' : theme.colors.purplelux[9]}
              fill={isLiked ? 'white' : 'none'}
            />
          </ActionIcon>

          <Text size="sm" c={subtleText}>
            {likes}
          </Text>
        </Group>

        {/* COMMENTS */}
        <Group gap={4}>
          <ActionIcon
            radius="xl"
            size="lg"
            variant="filled"
            onClick={onComment}
            style={{
              backgroundColor: softBg,
            }}
          >
            <IconMessage size={18} color={theme.colors.purplelux[9]} />
          </ActionIcon>

          <Text size="sm" c={subtleText}>
            {comments}
          </Text>
        </Group>
      </Group>
    </Card>
  )
}
