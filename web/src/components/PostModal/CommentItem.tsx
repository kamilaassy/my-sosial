import { useState } from 'react'

import {
  Avatar,
  Box,
  Flex,
  Text,
  ActionIcon,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core'
import { IconCornerDownRight } from '@tabler/icons-react'

import { useAuth } from 'src/auth'

import CommentForm from './CommentForm'
import CommentLikeButton from './CommentLikeButton'

export default function CommentItem({ comment, postId, onRefresh }) {
  const { colorScheme } = useMantineColorScheme()
  const theme = useMantineTheme()
  const isDark = colorScheme === 'dark'
  const { currentUser } = useAuth()

  const [replyMode, setReplyMode] = useState(false)
  const [showReplies, setShowReplies] = useState(false)

  const isLiked = comment.commentLikes.some((l) => l.userId === currentUser?.id)

  const textMain = isDark
    ? theme.colors.purplelux[0]
    : theme.colors.purplelux[9]

  const textSubtle = isDark
    ? 'rgba(255,255,255,0.6)'
    : theme.colors.purplelux[6]

  return (
    <Box mb={14}>
      {/* MAIN COMMENT */}
      <Flex gap={10}>
        <Avatar
          src={comment.author.avatarUrl || undefined}
          radius="xl"
          size={32}
        />

        <Box style={{ flex: 1 }}>
          <Text fw={600} size="sm" c={textMain}>
            {comment.author.name || comment.author.email}
          </Text>

          <Text size="sm" c={textSubtle} style={{ lineHeight: 1.5 }}>
            {comment.content}
          </Text>

          <Flex gap={12} mt={4} align="center">
            <CommentLikeButton
              commentId={comment.id}
              isLiked={isLiked}
              totalLikes={comment.commentLikes.length}
              onRefresh={onRefresh}
            />

            <ActionIcon
              variant="subtle"
              radius="xl"
              size="sm"
              onClick={() => setReplyMode((v) => !v)}
            >
              <IconCornerDownRight size={14} />
            </ActionIcon>
          </Flex>
        </Box>
      </Flex>

      {/* TOGGLE REPLIES */}
      {comment.replies.length > 0 && (
        <Text
          size="xs"
          ml={42}
          mt={4}
          c={textSubtle}
          style={{ cursor: 'pointer' }}
          onClick={() => setShowReplies((v) => !v)}
        >
          {showReplies
            ? 'Hide replies'
            : `View replies (${comment.replies.length})`}
        </Text>
      )}

      {/* REPLIES */}
      {showReplies &&
        comment.replies.map((r) => (
          <Flex key={r.id} gap={10} ml={42} mt={10}>
            <Avatar
              src={r.author.avatarUrl || undefined}
              radius="xl"
              size={28}
            />

            <Box>
              <Text fw={600} size="sm" c={textMain}>
                {r.author.name || r.author.email}
              </Text>
              <Text size="sm" c={textSubtle}>
                {r.content}
              </Text>
            </Box>
          </Flex>
        ))}

      {/* REPLY FORM */}
      {replyMode && (
        <Box ml={42} mt={10}>
          <CommentForm
            postId={postId}
            parentId={comment.id}
            onSuccess={() => {
              setReplyMode(false)
              onRefresh()
            }}
          />
        </Box>
      )}
    </Box>
  )
}
