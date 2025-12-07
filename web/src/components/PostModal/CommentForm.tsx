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
      content
      postId
      authorId
      parentId
      createdAt
      updatedAt

      author {
        id
        name
        email
        avatarUrl
      }

      commentLikes {
        id
        userId
      }

      replies {
        id
        content
        postId
        authorId
        parentId
        createdAt
        updatedAt

        author {
          id
          name
          email
          avatarUrl
        }

        commentLikes {
          id
          userId
        }
      }
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

  // ==========================
  // SEND HANDLER FIXED
  // ==========================
  const handleSend = () => {
    if (!content.trim()) return

    createComment({
      variables: {
        input: {
          content: content.trim(),
          postId,
          ...(parentId ? { parentId } : {}), // <-- FIX: tidak kirim null
        },
      },
    })
  }

  return (
    <Group mt="md" align="flex-end">
      {/* INPUT */}
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
            backgroundColor: isDark
              ? theme.colors.purplelux[8]
              : theme.colors.purplelux[0],
            borderColor: isDark
              ? theme.colors.purplelux[6]
              : theme.colors.purplelux[3],
            color: isDark
              ? theme.colors.purplelux[1]
              : theme.colors.purplelux[9],
            borderRadius: 12,
            paddingTop: 10,
            paddingBottom: 10,
          },
        }}
        style={{ flex: 1 }}
      />

      {/* SEND BUTTON */}
      <ActionIcon
        radius="xl"
        size={38}
        onClick={handleSend}
        disabled={!content.trim() || loading}
        style={{
          backgroundColor: !content.trim()
            ? 'rgba(150,150,150,0.2)'
            : isDark
              ? theme.colors.purplelux[6]
              : theme.colors.purplelux[7],
          color: theme.white,
          transition: '0.2s',
          cursor: !content.trim() ? 'not-allowed' : 'pointer',
        }}
      >
        <IconSend size={18} />
      </ActionIcon>
    </Group>
  )
}
