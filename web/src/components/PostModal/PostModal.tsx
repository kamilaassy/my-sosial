import React from 'react'

import {
  Modal,
  Box,
  Text,
  Avatar,
  Group,
  Loader,
  ActionIcon,
  useMantineTheme,
  useMantineColorScheme,
} from '@mantine/core'
import { IconX, IconHeart, IconMessageCircle } from '@tabler/icons-react'

import { useQuery, useMutation } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import CommentForm from 'src/components/PostModal/CommentForm'
import CommentList from 'src/components/PostModal/CommentList'
import { GlassCard } from 'src/components/ui/GlassCard'
import { GET_POST } from 'src/graphql/post'
import { TOGGLE_POST_LIKE } from 'src/graphql/togglePostLike'
import type { DetailedPost } from 'src/types/posts'

export default function PostModal({ postId, opened, onClose }) {
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'
  const { currentUser } = useAuth()
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const { data, loading, refetch } = useQuery(GET_POST, {
    variables: { id: postId },
    skip: !postId,
    fetchPolicy: 'cache-and-network',
  })

  const [toggleLike] = useMutation(TOGGLE_POST_LIKE, {
    onCompleted: () => refetch(),
  })

  if (!opened) return null
  const post: DetailedPost | undefined = data?.post

  /* ===================== TOKENS ===================== */
  const glassBg = isDark
    ? 'rgba(34, 34, 34, 0.81)'
    : 'rgba(233, 221, 221, 0.82)'

  const glassSoft = isDark
    ? 'rgba(34, 34, 34, 0.81)'
    : 'rgba(233, 221, 221, 0.82)'
  const textMain = isDark
    ? theme.colors.purplelux[0]
    : theme.colors.purplelux[9]

  const textSubtle = isDark
    ? 'rgba(255,255,255,0.6)'
    : theme.colors.purplelux[9]
  /* ================================================== */

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      withCloseButton={false}
      overlayProps={{ blur: 8, backgroundOpacity: 0.55 }}
      styles={{
        content: {
          background: 'transparent',
          border: 'none',
          boxShadow: 'none',
          padding: 0,
          maxWidth: 700,
        },
      }}
    >
      {/* CLOSE */}
      <ActionIcon
        onClick={onClose}
        radius="xl"
        size={36}
        variant="transparent"
        style={{
          position: 'absolute',
          right: 28,
          top: 28,
          zIndex: 10,
          background: glassSoft,
          backdropFilter: 'blur(12px)',
        }}
      >
        <IconX size={18} />
      </ActionIcon>

      <GlassCard
        radius={26}
        padding={0}
        style={{
          background: glassBg,
          border: isDark
            ? '1px solid rgba(255,255,255,0.12)'
            : '1px solid rgba(0,0,0,0.12)',
          overflow: 'hidden',
          height: '80vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* SCROLL */}
        <Box
          ref={scrollRef}
          style={{
            padding: 22,
            overflowY: 'auto',
            flex: 1,
          }}
        >
          {loading && (
            <Group justify="center" mt={40}>
              <Loader size="lg" />
            </Group>
          )}

          {post && (
            <>
              {/* HEADER */}
              <Group mb={18}>
                <Avatar
                  src={post.user.avatarUrl || undefined}
                  radius="xl"
                  size={48}
                />
                <Box>
                  <Text fw={700} size="sm" c={textMain}>
                    {post.user.name || post.user.email}
                  </Text>
                  <Text size="xs" c={textSubtle}>
                    {new Date(post.createdAt).toLocaleString()}
                  </Text>
                </Box>
              </Group>

              {/* IMAGE */}
              {post.imageUrl && (
                <Box mb={16} style={{ borderRadius: 18, overflow: 'hidden' }}>
                  <img
                    src={post.imageUrl}
                    alt=""
                    style={{ width: '100%', display: 'block' }}
                  />
                </Box>
              )}

              {/* CONTENT */}
              <Text mb={16} c={textMain} style={{ whiteSpace: 'pre-wrap' }}>
                {post.content}
              </Text>

              {/* ACTIONS */}
              <Group gap={16} mb={12}>
                <ActionIcon
                  variant="transparent"
                  onClick={() => toggleLike({ variables: { postId: post.id } })}
                  style={{
                    transition: 'transform 0.15s ease',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = 'scale(1.15)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = 'scale(1)')
                  }
                >
                  <IconHeart
                    size={20}
                    fill={
                      post.postLikes.some((l) => l.userId === currentUser?.id)
                        ? '#ff4d4f'
                        : 'none'
                    }
                    color={
                      post.postLikes.some((l) => l.userId === currentUser?.id)
                        ? '#ff4d4f'
                        : textMain
                    }
                  />
                </ActionIcon>

                <ActionIcon
                  variant="transparent"
                  style={{
                    transition: 'transform 0.15s ease',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = 'scale(1.15)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = 'scale(1)')
                  }
                >
                  <IconMessageCircle size={20} />
                </ActionIcon>
              </Group>

              <Text size="sm" fw={600} mb={16} c={textSubtle}>
                {post.postLikes.length} likes
              </Text>

              {/* COMMENTS */}
              <CommentList
                comments={post.comments}
                postId={post.id}
                onRefresh={() => refetch()}
              />
            </>
          )}
        </Box>

        {/* COMMENT INPUT */}
        <Box
          style={{
            padding: 16,
            background: glassSoft,
            backdropFilter: 'blur(14px)',
            borderTop: isDark
              ? '1px solid rgba(255,255,255,0.08)'
              : '1px solid rgba(0,0,0,0.08)',
          }}
        >
          <CommentForm
            postId={post?.id}
            onSuccess={() => {
              refetch().then(() => {
                scrollRef.current?.scrollTo({
                  top: scrollRef.current.scrollHeight,
                  behavior: 'smooth',
                })
              })
            }}
          />
        </Box>
      </GlassCard>
    </Modal>
  )
}
