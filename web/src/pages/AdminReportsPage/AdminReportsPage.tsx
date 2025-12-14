import { useMemo, useState, useEffect } from 'react'

import {
  Box,
  Text,
  Group,
  Tabs,
  TextInput,
  Table,
  Button,
  Badge,
  Drawer,
  Divider,
  Pagination,
  Loader,
  ScrollArea,
  ActionIcon,
  Tooltip,
  useComputedColorScheme,
} from '@mantine/core'
import { IconSearch, IconDownload, IconExternalLink } from '@tabler/icons-react'

import { useQuery, useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import {
  GET_ADMIN_REPORTS,
  RESOLVE_REPORT,
  ADMIN_BLOCK_USER,
} from 'src/graphql/getAdminReports'

/* ======================================================
   TYPES
====================================================== */
export type GraphQLReportStatus =
  | 'PENDING'
  | 'REVIEWED'
  | 'ACTION_TAKEN'
  | 'DISMISSED'

type ReportItem = {
  id: number
  reporterId: number
  reportedId?: number | null
  reason: string
  details?: string | null
  status: GraphQLReportStatus
  createdAt: string
  reporter: { id: number; name?: string | null; email: string }
  reported?: { id: number; name?: string | null; email: string } | null
  post?: { id: number; content?: string | null } | null
}

const STATUSES = [
  { key: 'ALL', label: 'All' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'REVIEWED', label: 'Reviewed' },
  { key: 'ACTION_TAKEN', label: 'Action Taken' },
  { key: 'DISMISSED', label: 'Dismissed' },
] as const

type StatusTab = (typeof STATUSES)[number]['key']
const PAGE_SIZE = 10

export default function AdminReportsPage() {
  const isDark = useComputedColorScheme() === 'dark'

  const [activeTab, setActiveTab] = useState<StatusTab>('ALL')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null)

  const graphqlStatus =
    activeTab === 'ALL' ? undefined : (activeTab as GraphQLReportStatus)

  const { data, loading, error, refetch } = useQuery(GET_ADMIN_REPORTS, {
    variables: { status: graphqlStatus },
  })

  const [resolveReport, resolveMeta] = useMutation(RESOLVE_REPORT, {
    onCompleted: () => {
      toast.success('Report resolved')
      refetch()
      setDrawerOpen(false)
    },
  })

  const [adminBlockUser, blockMeta] = useMutation(ADMIN_BLOCK_USER, {
    onCompleted: () => toast.success('User blocked'),
  })

  useEffect(() => setPage(1), [activeTab, search])

  const reports = useMemo(() => data?.adminReports ?? [], [data])
  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    if (!q) return reports

    return reports.filter((r) =>
      [
        r.reporter?.email,
        r.reported?.email,
        r.reason,
        r.details,
        r.post?.content,
      ]
        .join(' ')
        .toLowerCase()
        .includes(q)
    )
  }, [reports, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

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
          Admin Reports
        </Text>

        <Tooltip label="Export CSV">
          <ActionIcon variant="subtle">
            <IconDownload size={18} />
          </ActionIcon>
        </Tooltip>
      </Group>

      {/* TABS */}
      <Tabs value={activeTab} onChange={(v) => setActiveTab(v as StatusTab)}>
        <Tabs.List>
          {STATUSES.map((s) => (
            <Tabs.Tab key={s.key} value={s.key}>
              {s.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>

      {/* SEARCH */}
      <Group mt="md" mb="md">
        <TextInput
          leftSection={<IconSearch size={16} />}
          placeholder="Search reports..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1 }}
        />
        <Button variant="light" onClick={() => refetch()}>
          Refresh
        </Button>
      </Group>

      {/* TABLE */}
      <ScrollArea h={420}>
        <Table highlightOnHover withRowBorders={false}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Reporter</th>
              <th>Reported</th>
              <th>Reason</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {pageData.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.reporter.email}</td>
                <td>{r.reported?.email ?? '-'}</td>
                <td>{r.reason}</td>
                <td>
                  <Badge>{r.status}</Badge>
                </td>
                <td>
                  <Button
                    size="xs"
                    variant="subtle"
                    onClick={() => {
                      setSelectedReport(r)
                      setDrawerOpen(true)
                    }}
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </ScrollArea>

      {/* PAGINATION */}
      <Group justify="space-between" mt="md">
        <Text size="sm" c="dimmed">
          {filtered.length} reports
        </Text>
        <Pagination total={totalPages} value={page} onChange={setPage} />
      </Group>

      {/* DRAWER */}
      <Drawer
        opened={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        size="lg"
        styles={{
          content: {
            background: glassBg,
            backdropFilter: 'blur(18px)',
            border,
          },
        }}
        title={`Report #${selectedReport?.id ?? ''}`}
      >
        {selectedReport && (
          <>
            <Text fw={700}>{selectedReport.reason}</Text>
            <Text size="xs" c="dimmed">
              {new Date(selectedReport.createdAt).toLocaleString()}
            </Text>

            <Divider my="sm" />

            <Text fw={600}>Reporter</Text>
            <Text size="sm">{selectedReport.reporter.email}</Text>

            <Divider my="sm" />

            <Text fw={600}>Reported</Text>
            <Text size="sm">{selectedReport.reported?.email ?? '-'}</Text>

            <Divider my="sm" />

            <Text fw={600}>Post</Text>
            <Text size="sm">
              {selectedReport.post?.content ?? '[no content]'}
            </Text>

            {selectedReport.post && (
              <Button
                size="xs"
                variant="subtle"
                mt="xs"
                leftSection={<IconExternalLink size={14} />}
                onClick={() =>
                  window.open(`/post/${selectedReport.post?.id}`, '_blank')
                }
              >
                Open Post
              </Button>
            )}

            <Divider my="sm" />

            <Group>
              {selectedReport.reportedId && (
                <Button
                  color="red"
                  loading={blockMeta.loading}
                  onClick={() =>
                    adminBlockUser({
                      variables: { userId: selectedReport.reportedId! },
                    })
                  }
                >
                  Block User
                </Button>
              )}

              <Button
                color="green"
                loading={resolveMeta.loading}
                onClick={() =>
                  resolveReport({
                    variables: {
                      id: selectedReport.id,
                      action: 'ACTION_TAKEN',
                    },
                  })
                }
              >
                Take Action
              </Button>

              <Button
                variant="light"
                loading={resolveMeta.loading}
                onClick={() =>
                  resolveReport({
                    variables: { id: selectedReport.id, action: 'DISMISSED' },
                  })
                }
              >
                Dismiss
              </Button>
            </Group>
          </>
        )}
      </Drawer>
    </Box>
  )
}
