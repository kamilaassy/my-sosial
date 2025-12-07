import { useEffect } from 'react'

import { Text, Group, Divider, Loader, Badge, Box } from '@mantine/core'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  ResponsiveContainer,
} from 'recharts'

import { useQuery } from '@redwoodjs/web'

import { GET_USER_ACTIVITY } from 'src/graphql/getUserActivity'

export default function AdminUserActivityModal({ userId }) {
  const { data, loading, error, refetch } = useQuery(GET_USER_ACTIVITY, {
    variables: { userId },
    fetchPolicy: 'cache-and-network',
  })

  useEffect(() => {
    if (userId) refetch()
  }, [userId, refetch])

  if (loading) return <Loader />
  if (error) return <Text color="red">Error: {error.message}</Text>

  const stats = data.getUserActivity

  const chartData = [
    { name: 'Posts', value: stats.postsCount },
    { name: 'Likes Received', value: stats.postLikesReceived },
    { name: 'Comments', value: stats.commentsCount },
    { name: 'Comment Likes', value: stats.commentLikesReceived },
  ]

  return (
    <div>
      {/* HEADER */}
      <Group justify="space-between" mb="md">
        <Text fw={700} c="purplelux.1">
          User ID: {stats.userId}
        </Text>

        <Badge
          color={stats.engagementRate > 50 ? 'purplelux.4' : 'purplelux.2'}
          size="lg"
          radius="sm"
        >
          Engagement: {stats.engagementRate}%
        </Badge>
      </Group>

      {/* CHART CARD */}
      <Box
        style={{
          width: '100%',
          height: 260,
          backgroundColor: 'rgba(160, 92, 132, 0.08)', // purplelux soft overlay
          borderRadius: 12,
          padding: 10,
          border: '1px solid rgba(160, 92, 132, 0.25)',
        }}
      >
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <XAxis dataKey="name" stroke="#faeaed" />
            <YAxis stroke="#faeaed" />
            <ReTooltip />
            <Bar dataKey="value" fill="#A05C84" /> {/* purplelux[4] */}
          </BarChart>
        </ResponsiveContainer>
      </Box>

      <Divider my="sm" />

      {/* RECENT POSTS */}
      <Text fw={600} mb="xs" c="purplelux.1">
        Recent Posts
      </Text>

      {stats.recentPosts.length === 0 ? (
        <Text size="sm" c="purplelux.1">
          No recent posts
        </Text>
      ) : (
        stats.recentPosts.map((p) => (
          <Box
            key={p.id}
            style={{
              marginBottom: 12,
              padding: 12,
              borderRadius: 10,
              backgroundColor: 'rgba(139, 74, 113, 0.12)', // purplelux[5] tint
              border: '1px solid rgba(139, 74, 113, 0.25)',
            }}
          >
            <Text fw={600} size="sm" c="purplelux.1">
              #{p.id} — {new Date(p.createdAt).toLocaleString()}
            </Text>

            <Text size="sm" c="purplelux.0">
              {p.content?.slice(0, 120) || '[image only]'}
            </Text>

            <Text size="xs" c="purplelux.2">
              Likes: {p.likeCount} — Comments: {p.commentCount}
            </Text>
          </Box>
        ))
      )}

      <Divider my="sm" />

      {/* WEEKLY TREND */}
      <Text fw={600} mb="xs" c="purplelux.1">
        Weekly Posting Trend
      </Text>

      {stats.weeklyTrend.map((week) => (
        <Group key={week.label} justify="space-between" mb={4}>
          <Text size="sm" c="purplelux.0">
            {week.label}
          </Text>
          <Badge color="purplelux.4">{week.posts} posts</Badge>
        </Group>
      ))}
    </div>
  )
}
