import { useState } from 'react'

import {
  Box,
  TextInput,
  Group,
  Avatar,
  Paper,
  Text,
  Loader,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core'

import { navigate, routes } from '@redwoodjs/router'
import { useQuery } from '@redwoodjs/web'

import { SEARCH_USERS } from 'src/graphql/searchUsers'
import MainLayout from 'src/layouts/MainLayout/MainLayout'

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

  return (
    <MainLayout>
      <Box style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
        <TextInput
          placeholder="Search users..."
          radius="md"
          size="md"
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
        />

        {loading && (
          <Group justify="center" mt="lg">
            <Loader />
          </Group>
        )}

        {!loading && query.length > 0 && results.length === 0 && (
          <Text size="sm" c="dimmed" mt="md">
            No users found.
          </Text>
        )}

        <Box mt="lg">
          {results.map((user) => (
            <Paper
              key={user.id}
              p="sm"
              radius="md"
              withBorder
              style={{
                marginBottom: 10,
                cursor: 'pointer',
                backgroundColor: isDark
                  ? theme.colors.purplelux[8]
                  : theme.colors.purplelux[1],
              }}
              onClick={() => navigate(routes.profile({ id: user.id }))}
            >
              <Group>
                <Avatar
                  src={user.avatarUrl || undefined}
                  radius="xl"
                  size="lg"
                />

                <Box>
                  <Text fw={600}>{user.name || user.email}</Text>
                  <Text size="sm" c="dimmed">
                    {user.email}
                  </Text>
                </Box>
              </Group>
            </Paper>
          ))}
        </Box>
      </Box>
    </MainLayout>
  )
}
