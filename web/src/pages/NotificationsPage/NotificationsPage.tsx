import React, { useState, useEffect, useRef } from 'react'

import {
  Box,
  Text,
  Group,
  Avatar,
  useMantineTheme,
  useMantineColorScheme,
} from '@mantine/core'

import { navigate, routes } from '@redwoodjs/router'
import { useQuery, useMutation } from '@redwoodjs/web'

import PostModal from 'src/components/PostModal/PostModal'
import {
  GET_NOTIFICATIONS,
  MARK_READ,
  MARK_ALL_READ,
} from 'src/graphql/notifications'

export default function NotificationsPage() {
  /** -------------------------
   * Modal State
   ------------------------- */
  const [openedPostId, setOpenedPostId] = useState<number | null>(null)
  const openPost = (id: number) => setOpenedPostId(id)
  const closePost = () => setOpenedPostId(null)

  /** -------------------------
   * API Calls
   ------------------------- */
  const { data, loading, refetch } = useQuery(GET_NOTIFICATIONS)
  const notifications = data?.notifications || []

  const [markRead] = useMutation(MARK_READ, {
    onCompleted: () => refetch(),
  })

  const [markAll] = useMutation(MARK_ALL_READ, {
    onCompleted: () => refetch(),
  })

  /** -------------------------
   * Mark all unread as read (safe)
   ------------------------- */
  const hasMarkedRef = useRef(false)

  useEffect(() => {
    if (
      !loading &&
      !hasMarkedRef.current &&
      notifications.some((n) => !n.isRead)
    ) {
      markAll()
      hasMarkedRef.current = true
    }
  }, [loading, notifications])

  /** -------------------------
   * Theme Setup
   ------------------------- */
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'

  const cardBg = isDark ? theme.colors.purplelux[8] : theme.colors.purplelux[0]
  const unreadBg = isDark
    ? theme.colors.purplelux[7]
    : theme.colors.purplelux[1]

  const hoverBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'

  return (
    <>
      <Box style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
        <Text fw={700} size="xl" mb={20}>
          Notifications
        </Text>

        {loading && <Text>Loading...</Text>}

        {!loading && notifications.length === 0 && (
          <Text c="dimmed">No notifications yet</Text>
        )}

        {notifications.map((n) => {
          const bg = n.isRead ? cardBg : unreadBg

          return (
            <Box
              key={n.id}
              onClick={() => {
                if (!n.isRead) markRead({ variables: { id: n.id } })

                if (n.postId) {
                  openPost(n.postId)
                } else if (n.type === 'FOLLOW') {
                  navigate(routes.profile({ id: n.fromUser.id }))
                }
              }}
              style={{
                background: bg,
                padding: 15,
                borderRadius: 14,
                marginBottom: 14,
                cursor: 'pointer',
                transition: '0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = hoverBg)}
              onMouseLeave={(e) => (e.currentTarget.style.background = bg)}
            >
              <Group align="flex-start">
                <Avatar
                  src={n.fromUser.avatarUrl || undefined}
                  radius="xl"
                  size={45}
                />

                <Box style={{ flex: 1 }}>
                  <Group justify="space-between">
                    <Text fw={600}>{n.fromUser.name || n.fromUser.email}</Text>

                    {!n.isRead && (
                      <Box
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          background: isDark
                            ? theme.colors.purplelux[2]
                            : theme.colors.purplelux[8],
                        }}
                      />
                    )}
                  </Group>

                  <Box style={{ fontSize: 14, marginTop: 4 }}>
                    {n.type === 'LIKE' && <span>liked your post</span>}

                    {n.type === 'COMMENT' && (
                      <span>
                        commented: <b>{n.commentText}</b>
                      </span>
                    )}

                    {n.type === 'FOLLOW' && <span>followed you</span>}
                  </Box>

                  <Text size="xs" c="dimmed" mt={6}>
                    {new Date(n.createdAt).toLocaleString()}
                  </Text>
                </Box>
              </Group>
            </Box>
          )
        })}
      </Box>

      {/* ⭐ POST MODAL — X button works, smooth, clean */}
      <PostModal
        postId={openedPostId}
        opened={!!openedPostId}
        onClose={closePost}
      />
    </>
  )
}
