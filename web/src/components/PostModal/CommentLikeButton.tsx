import { ActionIcon, Text, Flex, useMantineColorScheme } from '@mantine/core'
import { IconHeart, IconHeartFilled } from '@tabler/icons-react'
import gql from 'graphql-tag'

import { useMutation } from '@redwoodjs/web'

const TOGGLE_COMMENT_LIKE = gql`
  mutation ToggleCommentLike($commentId: Int!) {
    toggleCommentLike(commentId: $commentId) {
      liked
      totalLikes
    }
  }
`

export default function CommentLikeButton({
  commentId,
  isLiked,
  totalLikes,
  onRefresh,
}) {
  const [toggleLike, { loading }] = useMutation(TOGGLE_COMMENT_LIKE, {
    onCompleted: () => onRefresh?.(),
  })

  const { colorScheme } = useMantineColorScheme()
  const dark = colorScheme === 'dark'

  return (
    <Flex align="center" gap={4}>
      <ActionIcon
        size="sm"
        variant="subtle"
        loading={loading}
        onClick={() => toggleLike({ variables: { commentId } })}
      >
        {isLiked ? (
          <IconHeartFilled size={16} color="red" />
        ) : (
          <IconHeart size={16} color={dark ? '#ccc' : '#444'} />
        )}
      </ActionIcon>

      <Text size="xs">{totalLikes}</Text>
    </Flex>
  )
}
