import { useMemo, useState, useEffect } from 'react'

import {
  Card,
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
} from '@mantine/core'
import { IconSearch, IconUserSearch } from '@tabler/icons-react'

import { useQuery, useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import AdminUserActivityModal from 'src/components/AdminUserActivityModal/AdminUserActivityModal'

/* ======================================================
    GRAPHQL QUERIES
====================================================== */

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

/* ======================================================
    TYPES
====================================================== */

type AdminUser = {
  id: number
  name: string | null
  email: string
  role: string
  isBanned: boolean
  createdAt: string
}

/* ======================================================
    PAGE COMPONENT
====================================================== */

export default function AdminUsersPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)

  const { data, loading, error, refetch } = useQuery(GET_USERS, {
    fetchPolicy: 'cache-and-network',
  })

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

  /* ======================================================
      USERS (MEMOIZED)
  ====================================================== */

  const users = useMemo<AdminUser[]>(() => {
    return data?.adminUsers ?? []
  }, [data?.adminUsers])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return users.filter((u) => {
      const entry = `${u.name ?? ''} ${u.email}`.toLowerCase()
      return entry.includes(q)
    })
  }, [users, search])

  /* PAGE SIZE */
  const PAGE_SIZE = 10
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => setPage(1), [search])

  /* ======================================================
      LOADING / ERROR
  ====================================================== */

  if (loading) return <Loader />
  if (error) return <Text color="red">Error: {error.message}</Text>

  /* ======================================================
      RENDER UI
  ====================================================== */

  return (
    <Card p="lg">
      <Group justify="space-between" mb="md">
        <Text fw={700} size="xl">
          Manage Users
        </Text>

        <Tooltip label="Search users">
          <ActionIcon>
            <IconUserSearch size={18} />
          </ActionIcon>
        </Tooltip>
      </Group>

      {/* SEARCH BAR */}
      <Group mb="md">
        <TextInput
          leftSection={<IconSearch size={16} />}
          placeholder="Search name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1 }}
        />
        <Button variant="outline" onClick={() => refetch()}>
          Refresh
        </Button>
      </Group>

      {/* TABLE */}
      <ScrollArea h={450}>
        <Table striped highlightOnHover withColumnBorders>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name / Email</th>
              <th>Role</th>
              <th>Created</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {pageData.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>
                  <div>
                    <Text fw={600}>{u.name ?? '-'}</Text>
                    <Text size="xs">{u.email}</Text>
                  </div>
                </td>
                <td>{u.role}</td>
                <td>{new Date(u.createdAt).toLocaleString()}</td>
                <td>
                  {u.isBanned ? (
                    <Badge color="red">BANNED</Badge>
                  ) : (
                    <Badge color="green">Active</Badge>
                  )}
                </td>

                {/* ACTION BUTTONS */}
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
                        color="blue"
                        onClick={() =>
                          unbanUser({ variables: { userId: u.id } })
                        }
                      >
                        Unban
                      </Button>
                    )}

                    <Button
                      size="xs"
                      variant="outline"
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
        <Text size="sm">{filtered.length} results</Text>
        <Pagination total={totalPages} value={page} onChange={setPage} />
      </Group>

      {/* MODAL FOR USER ACTIVITY */}
      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        size="lg"
        title="User Activity"
      >
        {selectedUserId && <AdminUserActivityModal userId={selectedUserId} />}
      </Modal>
    </Card>
  )
}
