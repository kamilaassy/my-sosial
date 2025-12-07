import { useState, useEffect } from 'react'

import { Box, Button, Text } from '@mantine/core'

import CommentItem from './CommentItem'

export default function CommentList({ comments, postId, onRefresh }) {
  const [limit, setLimit] = useState(5)

  // reset limit ke 5 setiap kali modal dibuka ulang / data berubah
  useEffect(() => {
    setLimit(5)
  }, [comments])

  if (!comments || comments.length === 0) {
    return (
      <Box>
        <Text size="sm" c="dimmed">
          No comments yet.
        </Text>
      </Box>
    )
  }

  const visible = comments.slice(0, limit)
  const hasMore = comments.length > limit
  const canShowLess = limit > 5

  return (
    <Box>
      {/* Visible Comments */}
      {visible.map((c) => (
        <CommentItem
          key={c.id}
          comment={c}
          postId={postId}
          onRefresh={onRefresh}
        />
      ))}

      {/* View more */}
      {hasMore && (
        <Button
          variant="subtle"
          size="xs"
          mt="xs"
          onClick={() => setLimit((l) => l + 5)}
        >
          View more comments
        </Button>
      )}

      {/* Show less */}
      {canShowLess && (
        <Button variant="subtle" size="xs" mt="xs" onClick={() => setLimit(5)}>
          Show less
        </Button>
      )}
    </Box>
  )
}
