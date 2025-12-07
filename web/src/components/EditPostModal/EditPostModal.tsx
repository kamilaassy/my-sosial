import { useEffect, useState } from 'react'

import { Modal, Textarea, Stack, Button } from '@mantine/core'
import type { Post } from 'types/graphql'

interface Props {
  post: Post | null
  opened: boolean
  onClose: () => void
  onSave: (updatedContent: string) => void
}

export default function EditPostModal({
  post,
  opened,
  onClose,
  onSave,
}: Props) {
  const [content, setContent] = useState('')

  useEffect(() => {
    if (post) setContent(post.content || '')
  }, [post])

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Edit Post"
      centered
      radius="lg"
      overlayProps={{
        blur: 12,
        backgroundOpacity: 0.55,
      }}
    >
      <Stack>
        <Textarea
          autosize
          minRows={3}
          value={content}
          onChange={(e) => setContent(e.currentTarget.value)}
        />

        <Button fullWidth onClick={() => onSave(content)}>
          Save Changes
        </Button>
      </Stack>
    </Modal>
  )
}
