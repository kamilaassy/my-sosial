import { Card, Group, Text, Button } from '@mantine/core'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

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

export const AdminControls = ({
  userId,
  isBanned,
}: {
  userId: number
  isBanned: boolean
}) => {
  const [banUser, banMeta] = useMutation(BAN_USER, {
    onCompleted: () => toast.success('User has been banned.'),
    refetchQueries: ['UserProfileQuery'],
  })

  const [unbanUser, unbanMeta] = useMutation(UNBAN_USER, {
    onCompleted: () => toast.success('User has been unbanned.'),
    refetchQueries: ['UserProfileQuery'],
  })

  return (
    <Card
      withBorder
      p="lg"
      radius="md"
      mb="lg"
      style={{
        background: 'var(--mantine-color-purplelux-1)',
        borderColor: 'var(--mantine-color-purplelux-3)',
      }}
    >
      <Text
        fw={700}
        mb="sm"
        size="lg"
        style={{ color: 'var(--mantine-color-purplelux-9)' }}
      >
        Admin Controls
      </Text>

      <Group wrap="wrap" gap="sm">
        {/* Ban / Unban */}
        {!isBanned ? (
          <Button
            color="red"
            loading={banMeta.loading}
            onClick={() => banUser({ variables: { userId } })}
          >
            Ban User
          </Button>
        ) : (
          <Button
            color="blue"
            loading={unbanMeta.loading}
            onClick={() => unbanUser({ variables: { userId } })}
          >
            Unban User
          </Button>
        )}

        {/* View Reports about this user */}
        <Button
          variant="outline"
          onClick={() => navigate(`/admin/reports?filterUserId=${userId}`)}
          style={{
            borderColor: 'var(--mantine-color-purplelux-4)',
            color: 'var(--mantine-color-purplelux-8)',
          }}
        >
          Reports About User
        </Button>

        {/* View Reports made by this user */}
        <Button
          variant="outline"
          onClick={() => navigate(`/admin/reports?reporterId=${userId}`)}
          style={{
            borderColor: 'var(--mantine-color-purplelux-4)',
            color: 'var(--mantine-color-purplelux-8)',
          }}
        >
          Reports Made By User
        </Button>

        {/* Go to Admin Panel */}
        <Button
          variant="light"
          onClick={() => navigate(routes.adminReports())}
          style={{
            background: 'var(--mantine-color-purplelux-0)',
            color: 'var(--mantine-color-purplelux-7)',
          }}
        >
          Admin Panel
        </Button>
      </Group>
    </Card>
  )
}
