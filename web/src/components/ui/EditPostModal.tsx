import { useState, useEffect } from 'react'

import {
  Modal,
  Textarea,
  Button,
  Stack,
  useMantineColorScheme,
} from '@mantine/core'

import type { FeedPostDTO } from 'src/types/feed'

interface EditPostModalProps {
  opened: boolean
  onClose: () => void
  post: FeedPostDTO | null
  onSave: (newText: string) => void
}

export const EditPostModal = ({
  opened,
  onClose,
  post,
  onSave,
}: EditPostModalProps) => {
  const [text, setText] = useState('')

  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'

  useEffect(() => {
    setText(post?.content ?? '')
  }, [post])

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Edit Post"
      centered
      radius="lg"
      overlayProps={{
        blur: 6,
        backgroundOpacity: 0.45,
      }}
      styles={{
        content: {
          background: isDark ? 'rgba(8,8,12,0.45)' : 'rgba(255,255,255,0.55)',
          backdropFilter: 'blur(18px)',
          border: '1px solid rgba(255,255,255,0.18)',
        },
      }}
    >
      <Stack>
        <Textarea
          classNames={{ input: 'textarea-input' }}
          value={text}
          onChange={(e) => setText(e.currentTarget.value)}
          autosize
          minRows={3}
          placeholder="Edit your post..."
        />

        <Button fullWidth onClick={() => onSave(text)}>
          Save Changes
        </Button>
      </Stack>
    </Modal>
  )
}
