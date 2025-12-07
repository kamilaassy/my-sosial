import { useState } from 'react'

import { TextInput, Box, Avatar, Paper, Group, Text } from '@mantine/core'

import { useQuery } from '@redwoodjs/web'

import { SEARCH_USERS } from 'src/graphql/searchUsers'

export default function SearchUser() {
  const [query, setQuery] = useState('')

  const { data, refetch } = useQuery(SEARCH_USERS, {
    variables: { query: '', skip: 0, take: 10 },
    skip: true, // <- penting agar tidak auto-run
    fetchPolicy: 'no-cache', // biar tidak cache hasil lama
  })

  const handleChange = (value: string) => {
    setQuery(value)

    if (value.trim().length === 0) return

    refetch({
      query: value,
      skip: 0,
      take: 10,
    })
  }

  return (
    <Box style={{ position: 'relative' }}>
      <TextInput
        placeholder="Search users..."
        value={query}
        onChange={(e) => handleChange(e.currentTarget.value)}
        radius="md"
      />

      {data?.searchUsers && query.length > 0 && (
        <Paper
          shadow="md"
          p="sm"
          style={{
            position: 'absolute',
            top: 50,
            left: 0,
            width: '100%',
            zIndex: 100,
          }}
        >
          {data.searchUsers.length === 0 && (
            <Text size="sm" c="dimmed">
              No users found
            </Text>
          )}

          {data.searchUsers.map((user) => (
            <Group key={user.id} p="xs" style={{ cursor: 'pointer' }}>
              <Avatar src={user.avatarUrl || undefined} radius="xl" />

              <Box>
                <Text fw={600}>{user.name || user.email}</Text>
                <Text size="xs" c="dimmed">
                  {user.email}
                </Text>
              </Box>
            </Group>
          ))}
        </Paper>
      )}
    </Box>
  )
}
