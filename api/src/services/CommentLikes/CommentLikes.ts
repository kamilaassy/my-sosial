import { ForbiddenError } from '@redwoodjs/graphql-server'

import { requireCurrentUser } from 'src/lib/currentUser'
import { db } from 'src/lib/db'

export const toggleCommentLike = async ({ commentId }, { context }) => {
  const user = requireCurrentUser(context) // ✔ cek auth DI DALAM resolver

  // Admin tidak boleh like comment
  if (String(user.role).toUpperCase() === 'ADMIN') {
    throw new ForbiddenError('Admins are not allowed to like comments..')
  }

  const existing = await db.commentLike.findFirst({
    where: { commentId, userId: user.id },
  })

  if (existing) {
    await db.commentLike.delete({
      where: { id: existing.id },
    })
  } else {
    await db.commentLike.create({
      data: { commentId, userId: user.id },
    })
  }

  const totalLikes = await db.commentLike.count({
    where: { commentId },
  })

  return {
    liked: !existing,
    totalLikes,
  }
}
