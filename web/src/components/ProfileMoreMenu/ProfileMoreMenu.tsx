import { Menu, ActionIcon, Text } from '@mantine/core'
import { modals } from '@mantine/modals'
import { IconDotsVertical, IconFlag, IconBan } from '@tabler/icons-react'

import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

const BLOCK_USER = gql`
  mutation BlockUserFromMenu($targetUserId: Int!) {
    blockUser(targetUserId: $targetUserId)
  }
`

export const ProfileMoreMenu = ({
  userId,
  onReport,
  onBlockSuccess,
}: {
  userId: number
  onReport: (id: number) => void
  onBlockSuccess?: () => void // ← TAMBAHKAN INI
}) => {
  const [blockUser] = useMutation(BLOCK_USER, {
    onCompleted: () => {
      toast.success('User blocked.')
      if (onBlockSuccess) onBlockSuccess() // ← PANGGIL CALLBACK DI SINI
    },
    onError: (err) => toast.error(err.message),
  })

  return (
    <Menu position="bottom-end" shadow="md" width={180}>
      <Menu.Target>
        <ActionIcon variant="light" size="lg">
          <IconDotsVertical size={20} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          onClick={() => onReport(userId)}
          leftSection={<IconFlag size={16} />}
        >
          Report User
        </Menu.Item>

        <Menu.Item
          color="red"
          leftSection={<IconBan size={16} />}
          onClick={() =>
            modals.openConfirmModal({
              title: 'Block User',
              centered: true,
              children: (
                <Text size="sm">Are you sure you want to block this user?</Text>
              ),
              labels: { confirm: 'Block', cancel: 'Cancel' },
              confirmProps: { color: 'red' },
              onConfirm: () =>
                blockUser({ variables: { targetUserId: userId } }),
            })
          }
        >
          Block User
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
