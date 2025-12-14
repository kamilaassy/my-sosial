import React, { useState } from 'react'

import {
  Box,
  Text,
  Group,
  Avatar,
  Button,
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
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'

  /* ================= DATA ================= */
  const { data, loading, refetch } = useQuery(GET_NOTIFICATIONS)
  const notifications = data?.notifications || []

  const [markRead] = useMutation(MARK_READ, {
    onCompleted: () => refetch(),
  })

  const [markAllRead] = useMutation(MARK_ALL_READ, {
    onCompleted: () => refetch(),
  })

  /* ================= POST MODAL ================= */
  const [openedPostId, setOpenedPostId] = useState<number | null>(null)

  /* ================= THEME ================= */
  const pageBg = isDark ? 'rgba(18,18,26,0.55)' : 'rgba(255,255,255,0.65)'

  const cardBg = isDark ? 'rgba(30,30,42,0.55)' : 'rgba(255,255,255,0.75)'

  const unreadBg = isDark ? 'rgba(120,120,255,0.18)' : 'rgba(160,160,255,0.25)'

  const hoverBg = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'

  return (
    <>
      <Box
        style={{
          maxWidth: 620,
          margin: '0 auto',
          padding: 24,
          background: pageBg,
          borderRadius: 20,
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* HEADER */}
        <Group justify="space-between" mb="lg">
          <Text fw={800} size="xl">
            Notifications
          </Text>

          {notifications.some((n) => !n.isRead) && (
            <Button size="xs" variant="light" onClick={() => markAllRead()}>
              Mark all read
            </Button>
          )}
        </Group>

        {/* STATES */}
        {loading && <Text c="dimmed">Loading…</Text>}

        {!loading && notifications.length === 0 && (
          <Text c="dimmed">No notifications yet</Text>
        )}

        {/* LIST */}
        {notifications.map((n) => {
          const bg = n.isRead ? cardBg : unreadBg

          return (
            <Box
              key={n.id}
              onClick={() => {
                if (!n.isRead) {
                  markRead({ variables: { id: n.id } })
                }

                if (n.postId) {
                  setOpenedPostId(n.postId)
                } else if (n.type === 'FOLLOW') {
                  navigate(routes.profile({ id: n.fromUser.id }))
                }
              }}
              style={{
                background: bg,
                padding: 14,
                borderRadius: 16,
                marginBottom: 14,
                cursor: 'pointer',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = hoverBg)}
              onMouseLeave={(e) => (e.currentTarget.style.background = bg)}
            >
              <Group align="flex-start">
                <Avatar
                  src={n.fromUser.avatarUrl || undefined}
                  radius="xl"
                  size={46}
                />

                <Box style={{ flex: 1 }}>
                  <Group justify="space-between">
                    <Text fw={600}>{n.fromUser.name || n.fromUser.email}</Text>

                    {!n.isRead && (
                      <Box
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: theme.colors.purplelux[5],
                        }}
                      />
                    )}
                  </Group>

                  <Text size="sm" mt={4}>
                    {n.type === 'LIKE' && 'liked your post'}
                    {n.type === 'COMMENT' && (
                      <>
                        commented:
                        <b> {n.commentText}</b>
                      </>
                    )}
                    {n.type === 'FOLLOW' && 'followed you'}
                  </Text>

                  <Text size="xs" c="dimmed" mt={6}>
                    {new Date(n.createdAt).toLocaleString()}
                  </Text>
                </Box>
              </Group>
            </Box>
          )
        })}
      </Box>

      {/* POST MODAL */}
      <PostModal
        postId={openedPostId}
        opened={!!openedPostId}
        onClose={() => setOpenedPostId(null)}
      />
    </>
  )
}
