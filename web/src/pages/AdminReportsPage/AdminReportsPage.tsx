import { useMemo, useState, useEffect } from 'react'

import {
  Card,
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
  Box,
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
    GRAPHQL TYPES
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

/* ======================================================
    CONSTANTS
====================================================== */

const STATUSES = [
  { key: 'ALL', label: 'All' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'REVIEWED', label: 'Reviewed' },
  { key: 'ACTION_TAKEN', label: 'Action Taken' },
  { key: 'DISMISSED', label: 'Dismissed' },
] as const

type StatusTab = (typeof STATUSES)[number]['key']

const PAGE_SIZE = 10

/* ======================================================
    PAGE COMPONENT
====================================================== */

export default function AdminReportsPage() {
  const [activeTab, setActiveTab] = useState<StatusTab>('ALL')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null)

  // map UI tab → GraphQL enum
  const graphqlStatus: GraphQLReportStatus | undefined =
    activeTab === 'ALL' ? undefined : (activeTab as GraphQLReportStatus)

  const { data, loading, error, refetch } = useQuery(GET_ADMIN_REPORTS, {
    variables: { status: graphqlStatus },
    fetchPolicy: 'cache-and-network',
  })

  const [resolveReport, resolveMeta] = useMutation(RESOLVE_REPORT, {
    onCompleted: () => {
      toast.success('Report resolved')
      refetch()
      setDrawerOpen(false)
    },
    onError: (e) => toast.error(e.message),
  })

  const [adminBlockUser, blockMeta] = useMutation(ADMIN_BLOCK_USER, {
    onCompleted: () => toast.success('User blocked'),
    onError: (e) => toast.error(e.message),
  })

  useEffect(() => setPage(1), [activeTab, search])

  /* ======================================================
      MEMOIZED REPORTS
  ====================================================== */
  const reports = useMemo(() => data?.adminReports ?? [], [data?.adminReports])

  /* ======================================================
      FILTER
  ====================================================== */
  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    if (!q) return reports

    return reports.filter((r) => {
      const reporter =
        `${r.reporter?.name ?? ''} ${r.reporter?.email}`.toLowerCase()
      const reported =
        `${r.reported?.name ?? ''} ${r.reported?.email ?? ''}`.toLowerCase()
      const postContent = (r.post?.content ?? '').toLowerCase()

      return (
        reporter.includes(q) ||
        reported.includes(q) ||
        r.reason.toLowerCase().includes(q) ||
        (r.details ?? '').toLowerCase().includes(q) ||
        postContent.includes(q)
      )
    })
  }, [reports, search])

  /* ======================================================
      PAGINATION
  ====================================================== */
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  /* ======================================================
      CSV EXPORT
  ====================================================== */
  const exportCSV = () => {
    const header = [
      'id',
      'reporterName',
      'reporterEmail',
      'reportedName',
      'reportedEmail',
      'reason',
      'details',
      'status',
      'createdAt',
      'postContent',
    ]

    const rows = filtered.map((r) => [
      r.id,
      r.reporter?.name ?? '',
      r.reporter?.email ?? '',
      r.reported?.name ?? '',
      r.reported?.email ?? '',
      `"${r.reason.replace(/"/g, '""')}"`,
      `"${(r.details ?? '').replace(/"/g, '""')}"`,
      r.status,
      r.createdAt,
      `"${(r.post?.content ?? '').replace(/"/g, '""')}"`,
    ])

    const csv = [header.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'admin_reports.csv'
    link.click()
  }

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
          Admin Reports
        </Text>

        <Tooltip label="Export CSV">
          <ActionIcon variant="filled" onClick={exportCSV}>
            <IconDownload size={18} />
          </ActionIcon>
        </Tooltip>
      </Group>

      <Tabs value={activeTab} onChange={(v) => setActiveTab(v as StatusTab)}>
        <Tabs.List>
          {STATUSES.map((s) => (
            <Tabs.Tab key={s.key} value={s.key}>
              {s.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>

      <Group mt="md" mb="md">
        <TextInput
          leftSection={<IconSearch size={16} />}
          placeholder="Search reports..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1 }}
        />

        <Button variant="outline" onClick={() => refetch()}>
          Refresh
        </Button>
      </Group>

      <ScrollArea h={420}>
        <Table striped highlightOnHover withColumnBorders>
          <thead>
            <tr>
              <th>ID</th>
              <th>Reporter</th>
              <th>Reported</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Post</th>
              <th></th>
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
                <td>{r.post?.content?.slice(0, 40) ?? '-'}</td>

                <td>
                  <Button
                    size="xs"
                    variant="outline"
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

      <Group justify="space-between" mt="md">
        <Text size="sm">{filtered.length} results</Text>

        <Pagination
          total={totalPages}
          value={page}
          onChange={(v) => setPage(v)}
        />
      </Group>

      <Drawer
        opened={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        size="lg"
        title={`Report #${selectedReport?.id ?? ''}`}
      >
        {selectedReport && (
          <>
            <Text fw={700}>{selectedReport.reason}</Text>
            <Text size="xs" color="dimmed">
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
            <Box>
              <Text size="sm">
                {selectedReport.post?.content ?? '[no text]'}
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
            </Box>

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
                variant="outline"
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
    </Card>
  )
}
