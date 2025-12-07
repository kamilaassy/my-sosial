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
import { GET_POST } from 'src/graphql/post'
import { TOGGLE_POST_LIKE } from 'src/graphql/togglePostLike'
import type { DetailedPost } from 'src/types/posts'

export default function PostModal({ postId, opened, onClose }) {
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'
  const { currentUser } = useAuth()
  const scrollRef = React.useRef(null)

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

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      fullScreen={false}
      centered
      withCloseButton={false}
      overlayProps={{
        blur: 6,
        backgroundOpacity: 0.45,
      }}
      styles={{
        content: {
          borderRadius: 20,
          backgroundColor: isDark
            ? theme.colors.purplelux[9]
            : theme.colors.purplelux[0],
          padding: 0,
          maxWidth: 650,
          width: '100%',
        },
      }}
    >
      {/* CLOSE BUTTON */}
      <ActionIcon
        onClick={onClose}
        radius="xl"
        size={36}
        variant="light"
        style={{
          position: 'absolute',
          right: 15,
          top: 15,
          backgroundColor: isDark
            ? theme.colors.purplelux[7]
            : theme.colors.purplelux[2],
        }}
      >
        <IconX size={20} />
      </ActionIcon>

      {/* WRAPPER UTAMA */}
      <Box style={{ display: 'flex', flexDirection: 'column', height: '80vh' }}>
        {/* SCROLL AREA */}
        <Box
          ref={scrollRef}
          style={{
            padding: 20,
            overflowY: 'auto',
            flex: 1,
          }}
        >
          {loading && (
            <Group justify="center" mt={40} mb={40}>
              <Loader size="lg" />
            </Group>
          )}

          {post && (
            <>
              {/* HEADER */}
              <Group mb={14}>
                <Avatar
                  src={post.user.avatarUrl || undefined}
                  radius="xl"
                  size={48}
                />

                <Box>
                  <Text fw={600} size="sm">
                    {post.user.name || post.user.email}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {new Date(post.createdAt).toLocaleString()}
                  </Text>
                </Box>
              </Group>

              {/* IMAGE */}
              {post.imageUrl && (
                <Box
                  style={{
                    marginBottom: 12,
                    borderRadius: 12,
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={post.imageUrl}
                    alt="post"
                    style={{
                      width: '100%',
                      display: 'block',
                    }}
                  />
                </Box>
              )}

              {/* CONTENT */}
              <Text mb={12} style={{ whiteSpace: 'pre-wrap' }}>
                {post.content}
              </Text>

              {/* ACTIONS */}
              <Group gap={18} mb={12}>
                <ActionIcon
                  size={34}
                  radius="xl"
                  onClick={() => toggleLike({ variables: { postId: post.id } })}
                  style={{
                    background: 'transparent',
                    color: post.postLikes.some(
                      (l) => l.userId === currentUser?.id
                    )
                      ? theme.colors.red[6]
                      : isDark
                        ? theme.colors.purplelux[1]
                        : theme.colors.purplelux[9],
                  }}
                >
                  <IconHeart
                    size={22}
                    fill={
                      post.postLikes.some((l) => l.userId === currentUser?.id)
                        ? theme.colors.red[6]
                        : 'none'
                    }
                    stroke={1.8}
                  />
                </ActionIcon>

                <ActionIcon
                  size={34}
                  radius="xl"
                  style={{
                    background: 'transparent',
                    color: isDark
                      ? theme.colors.purplelux[1]
                      : theme.colors.purplelux[9],
                  }}
                >
                  <IconMessageCircle size={22} stroke={1.8} />
                </ActionIcon>
              </Group>

              {/* LIKE COUNT */}
              <Text size="sm" fw={600} mb={10}>
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

        {/* STICKY COMMENT FORM */}
        <Box
          style={{
            padding: 16,
            borderTop: `1px solid ${
              isDark ? theme.colors.purplelux[7] : theme.colors.gray[3]
            }`,
            backgroundColor: isDark
              ? theme.colors.purplelux[9]
              : theme.colors.purplelux[0],
          }}
        >
          <CommentForm
            postId={post?.id}
            onSuccess={() => {
              refetch().then(() => {
                if (scrollRef.current) {
                  scrollRef.current.scrollTo({
                    top: scrollRef.current.scrollHeight,
                    behavior: 'smooth',
                  })
                }
              })
            }}
          />
        </Box>
      </Box>
    </Modal>
  )
}
