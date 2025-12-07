import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

/** ============================
 *  LIST USERS SAFE FOR ADMIN
 * ============================ */
export const adminUsers = async () => {
  await requireAuth({ roles: 'admin' })

  return db.user.findMany({
    where: { role: { not: 'admin' } },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isBanned: true,
      createdAt: true,
    },
  })
}

/** ============================
 *  USER ACTIVITY
 * ============================ */
export const getUserActivity = async ({ userId }) => {
  await requireAuth({ roles: 'admin' })

  // Counts
  const postsCount = await db.post.count({ where: { authorId: userId } })
  const commentsCount = await db.comment.count({ where: { authorId: userId } })

  const postLikesCount = await db.postLike.count({ where: { userId } })
  const commentLikesCount = await db.commentLike.count({ where: { userId } })

  const postLikesReceived = await db.postLike.count({
    where: { post: { authorId: userId } },
  })

  const commentLikesReceived = await db.commentLike.count({
    where: { comment: { authorId: userId } },
  })

  const engagementRate =
    postsCount > 0
      ? Math.round(
          ((postLikesReceived + commentLikesReceived) / postsCount) * 100
        )
      : 0

  // Recent Posts (clean & safe)
  const recentPosts = await db.post.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: {
      id: true,
      content: true,
      createdAt: true,
      imageUrl: true,
      postLikes: true,
      comments: true,
    },
  })

  // Format
  const formattedPosts = recentPosts.map((p) => ({
    id: p.id,
    content: p.content,
    imageUrl: p.imageUrl,
    createdAt: p.createdAt,
    likeCount: p.postLikes.length,
    commentCount: p.comments.length,
  }))

  // Weekly trend (4 minggu)
  const weeks = []
  const now = new Date()

  for (let i = 0; i < 4; i++) {
    const start = new Date(now)
    start.setDate(start.getDate() - (i + 1) * 7)

    const end = new Date(now)
    end.setDate(end.getDate() - i * 7)

    const count = await db.post.count({
      where: { authorId: userId, createdAt: { gte: start, lt: end } },
    })

    weeks.unshift({
      label: `Week ${4 - i}`,
      posts: count,
    })
  }

  return {
    userId,
    postsCount,
    commentsCount,
    postLikesCount,
    commentLikesCount,
    postLikesReceived,
    commentLikesReceived,
    engagementRate,
    recentPosts: formattedPosts,
    weeklyTrend: weeks,
  }
}

/** ============================
 *  BAN / UNBAN USER
 * ============================ */
export const banUser = async ({ userId }) => {
  await requireAuth({ roles: 'admin' })
  return db.user.update({
    where: { id: userId },
    data: { isBanned: true },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isBanned: true,
      createdAt: true,
    },
  })
}

export const unbanUser = async ({ userId }) => {
  await requireAuth({ roles: 'admin' })
  return db.user.update({
    where: { id: userId },
    data: { isBanned: false },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isBanned: true,
      createdAt: true,
    },
  })
}
