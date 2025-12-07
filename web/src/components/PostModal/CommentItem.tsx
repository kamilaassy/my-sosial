import { useState } from 'react'

import {
  Avatar,
  Box,
  Flex,
  Text,
  ActionIcon,
  useMantineColorScheme,
} from '@mantine/core'
import { IconCornerDownRight } from '@tabler/icons-react'

import { useAuth } from 'src/auth'

import CommentForm from './CommentForm'
import CommentLikeButton from './CommentLikeButton'

type Author = {
  id: number
  name?: string | null
  email: string
  avatarUrl?: string | null
}

type CommentLike = {
  id: number
  userId: number
}

type Reply = {
  id: number
  content: string
  author: Author
  commentLikes: CommentLike[]
}

type CommentType = {
  id: number
  content: string
  author: Author
  commentLikes: CommentLike[]
  replies: Reply[]
}

type Props = {
  comment: CommentType
  postId: number
  onRefresh: () => void
}

export default function CommentItem({ comment, postId, onRefresh }: Props) {
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'
  const { currentUser } = useAuth()

  const [replyMode, setReplyMode] = useState(false)
  const [showReplies, setShowReplies] = useState(false)

  const isLiked = comment.commentLikes.some((l) => l.userId === currentUser?.id)
  const totalLikes = comment.commentLikes.length

  return (
    <Box mb="md">
      {/* MAIN COMMENT */}
      <Flex align="flex-start" gap={10}>
        <Avatar
          src={comment.author.avatarUrl || undefined}
          radius="xl"
          size="sm"
          color="purplelux"
        />

        <Box>
          {/* USER NAME */}
          <Text size="sm" fw={700} c={isDark ? 'purplelux.1' : 'purplelux.9'}>
            {comment.author.name || comment.author.email}
          </Text>

          {/* COMMENT TEXT */}
          <Text
            size="sm"
            c={isDark ? 'purplelux.2' : 'purplelux.8'}
            style={{ lineHeight: 1.45 }}
          >
            {comment.content}
          </Text>

          {/* ACTIONS */}
          <Flex align="center" justify="space-between" mt={4}>
            <CommentLikeButton
              commentId={comment.id}
              isLiked={isLiked}
              totalLikes={totalLikes}
              onRefresh={onRefresh}
            />

            <ActionIcon
              variant="subtle"
              radius="xl"
              size="sm"
              onClick={() => setReplyMode((v) => !v)}
              color="purplelux"
            >
              <IconCornerDownRight size={15} />
            </ActionIcon>
          </Flex>
        </Box>
      </Flex>

      {/* REPLY TOGGLE */}
      {comment.replies.length > 0 && (
        <Text
          size="xs"
          ml={40}
          mt={6}
          c={isDark ? 'purplelux.3' : 'purplelux.7'}
          style={{ cursor: 'pointer' }}
          onClick={() => setShowReplies((v) => !v)}
        >
          {showReplies
            ? 'Hide replies'
            : `View replies (${comment.replies.length})`}
        </Text>
      )}

      {/* REPLIES LIST */}
      {showReplies &&
        comment.replies.map((r) => (
          <Flex key={r.id} gap={10} ml={40} mt={10}>
            <Avatar
              src={r.author.avatarUrl || undefined}
              radius="xl"
              size="sm"
            />

            <Box>
              <Text
                fw={600}
                size="sm"
                c={isDark ? 'purplelux.1' : 'purplelux.9'}
              >
                {r.author.name || r.author.email}
              </Text>

              <Text size="sm" c={isDark ? 'purplelux.3' : 'purplelux.7'}>
                {r.content}
              </Text>
            </Box>
          </Flex>
        ))}

      {/* REPLY FORM */}
      {replyMode && (
        <Box ml={40} mt={10}>
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
