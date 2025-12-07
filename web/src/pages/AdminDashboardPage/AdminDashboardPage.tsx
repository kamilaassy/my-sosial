import {
  Card,
  Text,
  Group,
  Badge,
  Button,
  SimpleGrid,
  Loader,
  Box,
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

/* ======================================================
    PAGE COMPONENT
====================================================== */

export default function AdminDashboardPage() {
  const isSmall = useMediaQuery('(max-width: 768px)')
  const { colorScheme } = useMantineColorScheme()
  const theme = useMantineTheme()
  const dark = colorScheme === 'dark'

  const { data, loading, error } = useQuery(DASHBOARD_QUERY, {
    fetchPolicy: 'cache-and-network',
  })

  if (loading)
    return (
      <Box style={{ minHeight: 300, display: 'grid', placeItems: 'center' }}>
        <Loader />
      </Box>
    )
  if (error) return <Text color="red">Error: {error.message}</Text>
  if (!data?.adminStats)
    return <Text color="red">No dashboard data available.</Text>

  const stats = data.adminStats

  const chartData =
    stats.weeklyPosts && stats.weeklyPosts.length > 0
      ? stats.weeklyPosts.map((w) => ({
          name: w.week,
          value: w.count,
        }))
      : // fallback: 4 empty weeks
        [
          { name: 'W-3', value: 0 },
          { name: 'W-2', value: 0 },
          { name: 'W-1', value: 0 },
          { name: 'Now', value: 0 },
        ]

  // Theme-driven colors (uses your purplelux palette)
  const axisColor = dark ? theme.colors.purplelux[0] : theme.colors.purplelux[8]
  const barColor = dark ? theme.colors.purplelux[2] : theme.colors.purplelux[5]
  const barGradientId = 'barGradientFill'
  const tooltipBg = dark ? theme.colors.purplelux[8] : theme.colors.purplelux[0]
  const tooltipText = dark
    ? theme.colors.purplelux[0]
    : theme.colors.purplelux[9]
  const gridStroke = dark
    ? theme.colors.purplelux[7]
    : theme.colors.purplelux[2]

  return (
    <Card p="lg">
      <Group justify="space-between" mb="md">
        <Title order={2}>Admin Dashboard</Title>
      </Group>

      <Divider my="sm" />

      {/* ======================================================
          KPI CARDS
      ====================================================== */}
      <SimpleGrid cols={isSmall ? 1 : 2} spacing="lg">
        <Card withBorder p="md" radius="md">
          <Text fw={600} size="lg">
            Total Users
          </Text>
          <Text fw={700} size="xl">
            {stats.totalUsers}
          </Text>
        </Card>

        <Card withBorder p="md" radius="md">
          <Text fw={600} size="lg">
            Banned Users
          </Text>
          <Text fw={700} size="xl">
            {stats.bannedUsers}
          </Text>
          <Badge color="red" mt="xs">
            {stats.bannedUsers} banned
          </Badge>
        </Card>

        <Card withBorder p="md" radius="md">
          <Text fw={600} size="lg">
            Total Reports
          </Text>
          <Text fw={700} size="xl">
            {stats.totalReports}
          </Text>
        </Card>

        <Card withBorder p="md" radius="md">
          <Text fw={600} size="lg">
            Pending Reports
          </Text>
          <Text fw={700} size="xl">
            {stats.pendingReports}
          </Text>
          <Badge color="yellow" mt="xs">
            {stats.pendingReports} pending
          </Badge>
        </Card>
      </SimpleGrid>

      <Divider my="lg" />

      {/* ======================================================
          WEEKLY ACTIVITY CHART
      ====================================================== */}
      <Box style={{ width: '100%', height: 340 }}>
        {/* Use an SVG gradient so bars get a soft fill */}
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            <linearGradient id={barGradientId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={barColor} stopOpacity={0.95} />
              <stop offset="100%" stopColor={barColor} stopOpacity={0.6} />
            </linearGradient>
          </defs>
        </svg>

        <ResponsiveContainer>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 16, left: 0, bottom: 8 }}
          >
            <CartesianGrid
              stroke={gridStroke}
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              stroke={axisColor}
              tick={{ fill: axisColor, fontSize: 12 }}
            />
            <YAxis
              stroke={axisColor}
              tick={{ fill: axisColor, fontSize: 12 }}
            />

            <ReTooltip
              wrapperStyle={{
                backgroundColor: tooltipBg,
                borderRadius: 10,
                padding: 8,
                border: `1px solid ${theme.colors.purplelux[3]}`,
                boxShadow: 'rgba(0,0,0,0.12) 0px 6px 18px',
              }}
              labelStyle={{ color: tooltipText }}
              itemStyle={{ color: tooltipText }}
            />

            <Bar
              dataKey="value"
              fill={`url(#${barGradientId})`}
              stroke={barColor}
              radius={[8, 8, 0, 0]}
              maxBarSize={48}
              animationDuration={700}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      <Divider my="lg" />

      {/* ======================================================
          QUICK ACTIONS
      ====================================================== */}
      <Group mt="md">
        <Button
          onClick={() => navigate(routes.adminReports())}
          variant="filled"
        >
          View Reports
        </Button>

        <Button variant="outline" onClick={() => navigate(routes.adminUsers())}>
          Manage Users
        </Button>

        <Button variant="light">System Settings</Button>
      </Group>
    </Card>
  )
}
