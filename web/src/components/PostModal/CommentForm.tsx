import { useState } from 'react'

import {
  Group,
  Textarea,
  ActionIcon,
  useMantineTheme,
  useMantineColorScheme,
} from '@mantine/core'
import { IconSend } from '@tabler/icons-react'
import gql from 'graphql-tag'

import { useMutation } from '@redwoodjs/web'

// ==========================
// MUTATION
// ==========================
const CREATE_COMMENT = gql`
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      id
    }
  }
`

// ==========================
// COMPONENT
// ==========================
export default function CommentForm({ postId, parentId = null, onSuccess }) {
  const [content, setContent] = useState('')
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'

  const [createComment, { loading }] = useMutation(CREATE_COMMENT, {
    onCompleted: () => {
      setContent('')
      onSuccess?.()
    },
  })

  const glassSoft = isDark
    ? 'rgba(34, 34, 34, 0.81)'
    : 'rgba(233, 221, 221, 0.82)'

  const textColor = isDark
    ? theme.colors.purplelux[0]
    : theme.colors.purplelux[9]

  // ==========================
  // SEND
  // ==========================
  const handleSend = () => {
    if (!content.trim()) return

    createComment({
      variables: {
        input: {
          content: content.trim(),
          postId,
          ...(parentId ? { parentId } : {}),
        },
      },
    })
  }

  return (
    <Group mt="md" align="flex-end" gap="sm">
      {/* TEXTAREA (GLASS) */}
      <Textarea
        value={content}
        onChange={(e) => setContent(e.currentTarget.value)}
        placeholder="Write a comment..."
        autosize
        minRows={1}
        maxRows={4}
        radius="md"
        styles={{
          input: {
            background: glassSoft,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: isDark
              ? 'rgba(34, 34, 34, 0.81)'
              : 'rgba(233, 221, 221, 0.82)',
            color: textColor,
            borderRadius: 14,
            padding: '10px 14px',
          },
        }}
        style={{ flex: 1 }}
      />

      {/* SEND BUTTON */}
      <ActionIcon
        radius="xl"
        size={40}
        onClick={handleSend}
        disabled={!content.trim() || loading}
        style={{
          background: !content.trim() ? glassSoft : theme.colors.purplelux[5],
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          color: 'white',
          opacity: !content.trim() ? 0.5 : 1,
          cursor: !content.trim() ? 'not-allowed' : 'pointer',
          transition: '0.15s ease',
        }}
      >
        <IconSend size={18} />
      </ActionIcon>
    </Group>
  )
}
