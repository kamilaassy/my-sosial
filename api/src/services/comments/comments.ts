import type { QueryResolvers, MutationResolvers } from 'types/graphql'

import { ForbiddenError } from '@redwoodjs/graphql-server'

import { requireCurrentUser } from 'src/lib/currentUser'
import { db } from 'src/lib/db'

/* ======================================================
   SHARED COMMENT SELECT
====================================================== */
const baseAuthorSelect = {
  id: true,
  name: true,
  email: true,
  avatarUrl: true,
}

const replySelect = {
  id: true,
  content: true,
  postId: true,
  authorId: true,
  parentId: true,
  createdAt: true,
  updatedAt: true,

  author: { select: baseAuthorSelect },

  commentLikes: {
    select: {
      id: true,
      userId: true,
    },
  },
}

const commentSelect = {
  ...replySelect,

  replies: {
    orderBy: { createdAt: 'asc' },
    select: replySelect,
  },
} as const

/* ======================================================
   GET COMMENTS
====================================================== */
export const comments: QueryResolvers['comments'] = ({ postId }) => {
  return db.comment.findMany({
    where: {
      postId,
      parentId: null,
    },
    orderBy: { createdAt: 'asc' },
    select: commentSelect,
  })
}

/* ======================================================
   GET SINGLE COMMENT
====================================================== */
export const comment: QueryResolvers['comment'] = ({ id }) => {
  return db.comment.findUnique({
    where: { id },
    select: commentSelect,
  })
}

/* ======================================================
   CREATE COMMENT / REPLY
   (ADMIN DIBLOK)
====================================================== */
export const createComment: MutationResolvers['createComment'] = async (
  { input },
  { context }
) => {
  const currentUser = requireCurrentUser(context)

  if (String(currentUser.role).toUpperCase() === 'ADMIN') {
    throw new ForbiddenError('Admins are not allowed to post comments.')
  }
  let notifyUserId: number | null = null

  // ====== REPLY ======
  if (input.parentId) {
    const parent = await db.comment.findUnique({
      where: { id: input.parentId },
    })

    if (!parent) throw new Error('Parent comment not found')

    if (parent.parentId !== null) {
      throw new ForbiddenError('Replies cannot have replies (1 level only)')
    }

    if (parent.authorId !== currentUser.id) {
      notifyUserId = parent.authorId
    }
  }

  // ====== TOP-LEVEL COMMENT ======
  else {
    const post = await db.post.findUnique({
      where: { id: input.postId },
      select: { authorId: true },
    })

    if (!post) throw new Error('Post not found')

    if (post.authorId !== currentUser.id) {
      notifyUserId = post.authorId
    }
  }

  const newComment = await db.comment.create({
    data: {
      content: input.content,
      postId: input.postId,
      parentId: input.parentId || null,
      authorId: currentUser.id,
    },
  })

  if (notifyUserId) {
    await db.notification.create({
      data: {
        type: 'COMMENT',
        fromUserId: currentUser.id,
        toUserId: notifyUserId,
        postId: input.postId,
        message: 'commented on your post',
        commentText: input.content,
      },
    })
  }

  return db.comment.findUnique({
    where: { id: newComment.id },
    select: commentSelect,
  })
}

/* ======================================================
   UPDATE COMMENT
====================================================== */
export const updateComment: MutationResolvers['updateComment'] = ({
  id,
  input,
}) => {
  return db.comment.update({
    where: { id },
    data: input,
    select: commentSelect,
  })
}

/* ======================================================
   DELETE COMMENT
   (Admin boleh hapus, tidak diblok)
====================================================== */
export const deleteComment: MutationResolvers['deleteComment'] = ({ id }) => {
  return db.comment.delete({
    where: { id },
    select: commentSelect,
  })
}
