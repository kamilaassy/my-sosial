import { useState } from 'react'

import {
  Box,
  TextInput,
  Group,
  Avatar,
  Text,
  Loader,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core'

import { navigate, routes } from '@redwoodjs/router'
import { useQuery } from '@redwoodjs/web'

import { GlassCard } from 'src/components/ui/GlassCard'
import { PageContainer } from 'src/components/ui/PageContainer'
import { SEARCH_USERS } from 'src/graphql/searchUsers'

export default function SearchPage() {
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'

  const [query, setQuery] = useState('')

  const { data, loading } = useQuery(SEARCH_USERS, {
    variables: { query, skip: 0, take: 20 },
    skip: query.trim() === '',
    fetchPolicy: 'no-cache',
  })

  const results = data?.searchUsers ?? []

  // ================= THEME TOKENS =================
  const glassSoft = isDark ? 'rgba(8,8,12,0.28)' : 'rgba(255,255,255,0.22)'

  const textMain = isDark
    ? theme.colors.purplelux[0]
    : theme.colors.purplelux[9]

  const textSubtle = isDark
    ? theme.colors.purplelux[2]
    : theme.colors.purplelux[6]

  return (
    <PageContainer>
      <Box style={{ maxWidth: 620, margin: '0 auto', padding: 20 }}>
        {/* SEARCH INPUT */}
        <TextInput
          placeholder="Search users..."
          radius="md"
          size="md"
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
          styles={{
            input: {
              background: glassSoft,
              backdropFilter: 'blur(14px)',
              borderColor: isDark
                ? theme.colors.purplelux[7]
                : theme.colors.purplelux[3],
            },
          }}
        />

        {/* LOADING */}
        {loading && (
          <Group justify="center" mt="lg">
            <Loader />
          </Group>
        )}

        {/* EMPTY */}
        {!loading && query.length > 0 && results.length === 0 && (
          <Text size="sm" c="dimmed" mt="md">
            No users found.
          </Text>
        )}

        {/* RESULTS */}
        <Box mt="lg">
          {results.map((user) => (
            <Box
              key={user.id}
              onClick={() => navigate(routes.profile({ id: user.id }))}
              style={{ cursor: 'pointer' }}
            >
              <GlassCard
                padding="md"
                radius={18}
                mb="sm"
                style={{
                  background: glassSoft,
                  backdropFilter: 'blur(14px)',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                }}
              >
                <Group>
                  <Avatar
                    src={user.avatarUrl || undefined}
                    radius="xl"
                    size={44}
                  />

                  <Box>
                    <Text fw={600} c={textMain}>
                      {user.name || user.email}
                    </Text>

                    <Text size="sm" c={textSubtle}>
                      {user.email}
                    </Text>
                  </Box>
                </Group>
              </GlassCard>
            </Box>
          ))}
        </Box>
      </Box>
    </PageContainer>
  )
}
