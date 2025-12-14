import { useMemo, useState, useEffect } from 'react'

import {
  Box,
  Text,
  Group,
  TextInput,
  Table,
  Button,
  Badge,
  Pagination,
  ScrollArea,
  Loader,
  ActionIcon,
  Tooltip,
  Modal,
  useComputedColorScheme,
} from '@mantine/core'
import { IconSearch, IconUserSearch } from '@tabler/icons-react'
import { gql } from 'graphql-tag'

import { useQuery, useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import AdminUserActivityModal from 'src/components/AdminUserActivityModal/AdminUserActivityModal'

/* =======================
   GRAPHQL
======================= */
const GET_USERS = gql`
  query AdminUsers {
    adminUsers {
      id
      name
      email
      role
      isBanned
      createdAt
    }
  }
`

const BAN_USER = gql`
  mutation BanUser($userId: Int!) {
    banUser(userId: $userId) {
      id
      isBanned
    }
  }
`

const UNBAN_USER = gql`
  mutation UnbanUser($userId: Int!) {
    unbanUser(userId: $userId) {
      id
      isBanned
    }
  }
`

type AdminUser = {
  id: number
  name: string | null
  email: string
  role: string
  isBanned: boolean
  createdAt: string
}

export default function AdminUsersPage() {
  const isDark = useComputedColorScheme() === 'dark'

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)

  const { data, loading, error, refetch } = useQuery(GET_USERS)

  const [banUser] = useMutation(BAN_USER, {
    onCompleted: () => {
      toast.success('User banned')
      refetch()
    },
    onError: (e) => toast.error(e.message),
  })

  const [unbanUser] = useMutation(UNBAN_USER, {
    onCompleted: () => {
      toast.success('User unbanned')
      refetch()
    },
    onError: (e) => toast.error(e.message),
  })

  const users = useMemo<AdminUser[]>(() => data?.adminUsers ?? [], [data])
  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return users.filter((u) =>
      `${u.name ?? ''} ${u.email}`.toLowerCase().includes(q)
    )
  }, [users, search])

  const PAGE_SIZE = 10
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => setPage(1), [search])

  if (loading) return <Loader />
  if (error) return <Text c="red">{error.message}</Text>

  /* =======================
     GLASS TOKENS
  ======================= */
  const glassBg = isDark ? 'rgba(20,20,28,0.55)' : 'rgba(255,255,255,0.65)'

  const border = isDark
    ? '1px solid rgba(255,255,255,0.12)'
    : '1px solid rgba(0,0,0,0.08)'

  return (
    <Box
      p="lg"
      style={{
        background: glassBg,
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        border,
        borderRadius: 20,
      }}
    >
      {/* HEADER */}
      <Group justify="space-between" mb="md">
        <Text fw={800} size="xl">
          Manage Users
        </Text>

        <Tooltip label="Search users">
          <ActionIcon variant="subtle">
            <IconUserSearch size={18} />
          </ActionIcon>
        </Tooltip>
      </Group>

      {/* SEARCH */}
      <Group mb="md">
        <TextInput
          leftSection={<IconSearch size={16} />}
          placeholder="Search name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1 }}
        />
        <Button variant="light" onClick={() => refetch()}>
          Refresh
        </Button>
      </Group>

      {/* TABLE */}
      <ScrollArea h={460}>
        <Table highlightOnHover withRowBorders={false} verticalSpacing="sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Role</th>
              <th>Created</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {pageData.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>
                  <Text fw={600}>{u.name ?? '-'}</Text>
                  <Text size="xs" c="dimmed">
                    {u.email}
                  </Text>
                </td>
                <td>{u.role}</td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  {u.isBanned ? (
                    <Badge color="red">BANNED</Badge>
                  ) : (
                    <Badge color="green">ACTIVE</Badge>
                  )}
                </td>
                <td>
                  <Group gap="xs">
                    {!u.isBanned ? (
                      <Button
                        size="xs"
                        color="red"
                        onClick={() => banUser({ variables: { userId: u.id } })}
                      >
                        Ban
                      </Button>
                    ) : (
                      <Button
                        size="xs"
                        onClick={() =>
                          unbanUser({ variables: { userId: u.id } })
                        }
                      >
                        Unban
                      </Button>
                    )}

                    <Button
                      size="xs"
                      variant="subtle"
                      onClick={() => {
                        setSelectedUserId(u.id)
                        setModalOpen(true)
                      }}
                    >
                      Activity
                    </Button>
                  </Group>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </ScrollArea>

      {/* PAGINATION */}
      <Group justify="space-between" mt="md">
        <Text size="sm" c="dimmed">
          {filtered.length} users
        </Text>
        <Pagination total={totalPages} value={page} onChange={setPage} />
      </Group>

      {/* MODAL */}
      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        size="lg"
        centered
        styles={{
          content: {
            background: glassBg,
            backdropFilter: 'blur(18px)',
            border,
          },
        }}
      >
        {selectedUserId && <AdminUserActivityModal userId={selectedUserId} />}
      </Modal>
    </Box>
  )
}
