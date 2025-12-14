import {
  Box,
  Text,
  Group,
  Badge,
  Button,
  SimpleGrid,
  Loader,
  Title,
  Divider,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

import { navigate, routes } from '@redwoodjs/router'
import { useQuery } from '@redwoodjs/web'

import { GlassCard } from 'src/components/ui/GlassCard'

/* ======================================================
   GRAPHQL DASHBOARD QUERY
====================================================== */
export const DASHBOARD_QUERY = gql`
  query AdminDashboard {
    adminStats {
      totalUsers
      bannedUsers
      totalReports
      pendingReports
      weeklyPosts {
        week
        count
      }
    }
  }
`

export default function AdminDashboardPage() {
  const isSmall = useMediaQuery('(max-width: 768px)')
  const { colorScheme } = useMantineColorScheme()
  const theme = useMantineTheme()
  const isDark = colorScheme === 'dark'

  const { data, loading, error } = useQuery(DASHBOARD_QUERY, {
    fetchPolicy: 'cache-and-network',
  })

  if (loading)
    return (
      <Box style={{ minHeight: 300, display: 'grid', placeItems: 'center' }}>
        <Loader />
      </Box>
    )

  if (error) return <Text c="red">{error.message}</Text>
  if (!data?.adminStats)
    return <Text c="red">No dashboard data available.</Text>

  const stats = data.adminStats

  const chartData =
    stats.weeklyPosts?.length > 0
      ? stats.weeklyPosts.map((w) => ({
          name: w.week,
          value: w.count,
        }))
      : [
          { name: 'W-3', value: 0 },
          { name: 'W-2', value: 0 },
          { name: 'W-1', value: 0 },
          { name: 'Now', value: 0 },
        ]

  /* =========================
     THEME TOKENS
  ========================= */
  const textMain = isDark
    ? theme.colors.purplelux[0]
    : theme.colors.purplelux[9]

  const textSubtle = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'

  const barColor = isDark
    ? theme.colors.purplelux[4]
    : theme.colors.purplelux[6]

  const gridStroke = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'

  return (
    <Box>
      {/* HEADER */}
      <Group justify="space-between" mb="md">
        <Title order={2} c={textMain}>
          Admin Dashboard
        </Title>
      </Group>

      <Divider my="sm" />

      {/* =========================
         KPI GLASS CARDS
      ========================= */}
      <SimpleGrid cols={isSmall ? 1 : 2} spacing="lg">
        <GlassCard padding="md">
          <Text fw={600} c={textSubtle}>
            Total Users
          </Text>
          <Text fw={800} size="xl" c={textMain}>
            {stats.totalUsers}
          </Text>
        </GlassCard>

        <GlassCard padding="md">
          <Text fw={600} c={textSubtle}>
            Banned Users
          </Text>
          <Text fw={800} size="xl" c={textMain}>
            {stats.bannedUsers}
          </Text>
          <Badge color="red" mt="xs">
            {stats.bannedUsers} banned
          </Badge>
        </GlassCard>

        <GlassCard padding="md">
          <Text fw={600} c={textSubtle}>
            Total Reports
          </Text>
          <Text fw={800} size="xl" c={textMain}>
            {stats.totalReports}
          </Text>
        </GlassCard>

        <GlassCard padding="md">
          <Text fw={600} c={textSubtle}>
            Pending Reports
          </Text>
          <Text fw={800} size="xl" c={textMain}>
            {stats.pendingReports}
          </Text>
          <Badge color="yellow" mt="xs">
            {stats.pendingReports} pending
          </Badge>
        </GlassCard>
      </SimpleGrid>

      <Divider my="lg" />

      {/* =========================
         WEEKLY POSTS CHART
      ========================= */}
      <GlassCard padding="md">
        <Text fw={700} mb="sm" c={textMain}>
          Weekly Posts Activity
        </Text>

        <Box style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid
                stroke={gridStroke}
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="name"
                tick={{ fill: textSubtle, fontSize: 12 }}
                stroke={gridStroke}
              />
              <YAxis
                tick={{ fill: textSubtle, fontSize: 12 }}
                stroke={gridStroke}
              />

              <ReTooltip
                contentStyle={{
                  background: isDark
                    ? 'rgba(20,20,28,0.9)'
                    : 'rgba(255,255,255,0.9)',
                  borderRadius: 10,
                  border: gridStroke,
                  color: textMain,
                }}
              />

              {/* ❌ NO GRADIENT */}
              <Bar
                dataKey="value"
                fill={barColor}
                radius={[8, 8, 0, 0]}
                maxBarSize={48}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </GlassCard>

      <Divider my="lg" />

      {/* =========================
         QUICK ACTIONS
      ========================= */}
      <Group>
        <Button onClick={() => navigate(routes.adminReports())}>
          View Reports
        </Button>

        <Button variant="light" onClick={() => navigate(routes.adminUsers())}>
          Manage Users
        </Button>

        <Button variant="subtle">System Settings</Button>
      </Group>
    </Box>
  )
}
