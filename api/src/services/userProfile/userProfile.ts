import type { QueryResolvers, MutationResolvers } from 'types/graphql'

import {
  AuthenticationError,
  ForbiddenError,
  context,
} from '@redwoodjs/graphql-server'

import { uploadAvatarBuffer } from 'src/lib/cloudinary'
import { db } from 'src/lib/db'

export const userProfile: QueryResolvers['userProfile'] = async ({ id }) => {
  const currentUserId = context.currentUser?.id

  const user = await db.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      bio: true,
      avatarUrl: true,
      createdAt: true,
      isBanned: true,
    },
  })

  if (!user) throw new Error('User not found')

  const followers = await db.follow.count({ where: { followingId: id } })
  const following = await db.follow.count({ where: { followerId: id } })
  const posts = await db.post.count({ where: { authorId: id } })

  // --- IMPORTANT: BLOCK RELATION CHECK ---
  const isBlockedByMe = await db.block.findFirst({
    where: { blockerId: currentUserId, blockedId: id },
  })

  const hasBlockedMe = await db.block.findFirst({
    where: { blockerId: id, blockedId: currentUserId },
  })

  return {
    ...user,
    followers,
    following,
    posts,
    isBlockedByMe: !!isBlockedByMe,
    hasBlockedMe: !!hasBlockedMe,
  }
}

export const userPosts: QueryResolvers['userPosts'] = async ({ userId }) => {
  const currentUserId = context.currentUser?.id

  // Block check
  const hasBlockedMe = await db.block.findFirst({
    where: { blockerId: userId, blockedId: currentUserId },
  })

  const isBlockedByMe = await db.block.findFirst({
    where: { blockerId: currentUserId, blockedId: userId },
  })

  // Jika salah satu block → posts kosong
  if (hasBlockedMe || isBlockedByMe) {
    return []
  }

  return db.post.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: 'desc' },
    select: {
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
        select: {
          id: true,
          content: true,
          postId: true,
          authorId: true,
          parentId: true,
          createdAt: true,
          updatedAt: true,

          author: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true,
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
            select: {
              id: true,
              content: true,
              authorId: true,
              createdAt: true,
              updatedAt: true,

              author: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  avatarUrl: true,
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
    },
  })
}

export const isFollowing: QueryResolvers['isFollowing'] = async ({
  targetUserId,
}) => {
  const currentUserId = context.currentUser?.id
  if (!currentUserId) throw new AuthenticationError('Not authenticated')

  return !!(await db.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: currentUserId,
        followingId: targetUserId,
      },
    },
  }))
}

export const toggleFollow: MutationResolvers['toggleFollow'] = async ({
  targetUserId,
}) => {
  const currentUserId = context.currentUser?.id
  if (!currentUserId) throw new AuthenticationError('Not authenticated')
  if (currentUserId === targetUserId)
    throw new ForbiddenError('You cannot follow yourself')

  const existing = await db.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: currentUserId,
        followingId: targetUserId,
      },
    },
  })

  // --- UNFOLLOW ---
  if (existing) {
    await db.follow.delete({
      where: { id: existing.id },
    })
    return { followed: false }
  }

  // --- FOLLOW ---
  const _follow = await db.follow.create({
    data: {
      followerId: currentUserId,
      followingId: targetUserId,
    },
  })

  // Get user name for message
  const fromUser = await db.user.findUnique({
    where: { id: currentUserId },
    select: { name: true, email: true },
  })

  // Create notification
  await db.notification.create({
    data: {
      type: 'FOLLOW',
      fromUserId: currentUserId,
      toUserId: targetUserId,
      message: `${fromUser?.name || fromUser?.email} started following you.`,
    },
  })

  return { followed: true }
}

export const updateUserProfile: MutationResolvers['updateUserProfile'] =
  async ({ input }) => {
    const currentUserId = context.currentUser?.id
    if (!currentUserId) throw new AuthenticationError('Not authenticated')

    // ===============================
    // VALIDASI USERNAME / EMAIL
    // ===============================
    if (input.email) {
      const exists = await db.user.findUnique({
        where: { email: input.email },
      })

      if (exists && exists.id !== currentUserId) {
        throw new Error('Username already taken')
      }
    }

    // ===============================
    // AVATAR UPLOAD (OPTIONAL)
    // ===============================
    let avatarUrl: string | undefined = undefined

    if (input.avatarBase64) {
      const matches = input.avatarBase64.match(
        /^data:(image\/\w+);base64,(.+)$/
      )

      if (!matches) {
        throw new Error('Invalid avatar image format')
      }

      const buffer = Buffer.from(matches[2], 'base64')

      avatarUrl = await uploadAvatarBuffer(buffer)
    }

    // ===============================
    // UPDATE USER
    // ===============================
    const updated = await db.user.update({
      where: { id: currentUserId },
      data: {
        email: input.email ?? undefined,
        name: input.name ?? undefined,
        bio: input.bio ?? undefined,
        ...(avatarUrl && { avatarUrl }),
      },
    })

    // ===============================
    // COUNTERS
    // ===============================
    const followers = await db.follow.count({
      where: { followingId: currentUserId },
    })

    const following = await db.follow.count({
      where: { followerId: currentUserId },
    })

    const posts = await db.post.count({
      where: { authorId: currentUserId },
    })

    return {
      ...updated,
      followers,
      following,
      posts,
      isBlockedByMe: false,
      hasBlockedMe: false,
    }
  }
