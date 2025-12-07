import { useState, useEffect } from 'react'

import {
  Modal,
  Textarea,
  Button,
  Stack,
  useMantineTheme,
  useMantineColorScheme,
} from '@mantine/core'

import type { FeedPost } from 'src/types/posts'

interface EditPostModalProps {
  opened: boolean
  onClose: () => void
  post: FeedPost | null
  onSave: (newText: string) => void
}

export const EditPostModal = ({
  opened,
  onClose,
  post,
  onSave,
}: EditPostModalProps) => {
  const [text, setText] = useState('')

  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'

  const bg = isDark ? theme.colors.purplelux[9] : theme.colors.purplelux[1]
  const border = isDark ? theme.colors.purplelux[6] : theme.colors.purplelux[2]
  const textColor = isDark
    ? theme.colors.purplelux[0]
    : theme.colors.purplelux[9]

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
        content: { backgroundColor: bg, border: `1px solid ${border}` },
        header: {
          backgroundColor: isDark
            ? theme.colors.purplelux[9]
            : theme.colors.purplelux[1],
          color: textColor,
        },
        title: { color: textColor },
        close: { color: textColor },
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
