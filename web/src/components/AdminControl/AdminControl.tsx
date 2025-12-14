import { Group, Text, Button } from '@mantine/core'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { GlassCard } from 'src/components/ui/GlassCard'

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
    <GlassCard radius={20} padding="lg" mb="lg">
      <Text fw={700} mb="sm" size="lg">
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

        {/* Reports about this user */}
        <Button
          variant="outline"
          onClick={() => navigate(`/admin/reports?filterUserId=${userId}`)}
        >
          Reports About User
        </Button>

        {/* Reports made by this user */}
        <Button
          variant="outline"
          onClick={() => navigate(`/admin/reports?reporterId=${userId}`)}
        >
          Reports Made By User
        </Button>

        {/* Go to Admin Panel */}
        <Button variant="light" onClick={() => navigate(routes.adminReports())}>
          Admin Panel
        </Button>
      </Group>
    </GlassCard>
  )
}
