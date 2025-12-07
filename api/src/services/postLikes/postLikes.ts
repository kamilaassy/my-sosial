import type { MutationResolvers } from 'types/graphql'

import { ForbiddenError } from '@redwoodjs/graphql-server'

import { requireCurrentUser } from 'src/lib/currentUser'
import { db } from 'src/lib/db'

// ----------------------------------------
// SELECTOR UNTUK FULL POST
// ----------------------------------------
const postSelect = {
  id: true,
  content: true,
  imageUrl: true,
  createdAt: true,

  user: {
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
    },
  },

  postLikes: {
    select: {
      id: true,
      userId: true,
    },
  },

  comments: {
    orderBy: { createdAt: 'asc' },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          email: true,
        },
      },
      commentLikes: {
        select: {
          id: true,
          userId: true,
        },
      },
      replies: {
        orderBy: { createdAt: 'asc' },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
              email: true,
            },
          },
          commentLikes: {
            select: {
              id: true,
              userId: true,
            },
          },
        },
      },
    },
  },
} as const

// ----------------------------------------
// Helper: Ambil Full Post
// ----------------------------------------
async function getFullPost(postId: number) {
  return db.post.findUnique({
    where: { id: postId },
    select: postSelect,
  })
}

// ----------------------------------------
// MAIN: Toggle Like
// ----------------------------------------
export const togglePostLike: MutationResolvers['togglePostLike'] = async (
  { postId },
  { context }
) => {
  const user = requireCurrentUser(context)
  if (String(user.role).toUpperCase() === 'ADMIN') {
    throw new ForbiddenError('Admins are not allowed to give likes.')
  }

  // Ambil post
  const post = await db.post.findUnique({
    where: { id: postId },
    select: { authorId: true },
  })

  if (!post) throw new Error('Post not found')

  // Cek existing like
  const existing = await db.postLike.findFirst({
    where: {
      postId,
      userId: user.id,
    },
  })

  // ============================
  // CASE 1 — UNLIKE
  // ============================
  if (existing) {
    await db.postLike.delete({
      where: { id: existing.id },
    })

    const full = await getFullPost(postId)
    return { post: full! }
  }

  // ============================
  // CASE 2 — LIKE
  // ============================
  await db.postLike.create({
    data: {
      postId,
      userId: user.id,
    },
  })

  // ============================
  // CREATE NOTIFICATION
  // Hanya jika bukan like diri sendiri
  // ============================
  if (post.authorId !== user.id) {
    await db.notification.create({
      data: {
        type: 'LIKE',
        toUserId: post.authorId,
        fromUserId: user.id,
        postId: postId,
        message: 'liked your post',
      },
    })
  }

  // RETURN FULL POST
  const full = await getFullPost(postId)
  return { post: full! }
}
