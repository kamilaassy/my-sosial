import type {
  QueryResolvers,
  MutationResolvers,
  UserRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'
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

/* ============================================================
   SELECT untuk post
============================================================ */
const postSelect = {
  id: true,
  content: true,
  imageUrl: true,
  createdAt: true,

  user: { select: baseAuthorSelect },

  postLikes: {
    select: {
      id: true,
      userId: true,
    },
  },

  comments: {
    where: { parentId: null },
    orderBy: { createdAt: 'asc' },
    select: commentSelect,
  },
} as const

/* ============================================================
   GET USER BY ID — jika admin, kembalikan null
============================================================ */
export const user: QueryResolvers['user'] = ({ id }) => {
  return db.user.findUnique({
    where: { id },
  })
}

/* ============================================================
   MUTATIONS — (opsional) admin-only handle
   Tidak diubah karena tergantung logika aplikasi
============================================================ */
export const createUser: MutationResolvers['createUser'] = ({ input }) => {
  return db.user.create({
    data: input,
  })
}

export const updateUser: MutationResolvers['updateUser'] = ({ id, input }) => {
  return db.user.update({
    data: input,
    where: { id },
  })
}

export const deleteUser: MutationResolvers['deleteUser'] = ({ id }) => {
  return db.user.delete({
    where: { id },
  })
}

/* ============================================================
   RELATIONAL FIELDS
============================================================ */
export const User: UserRelationResolvers = {
  comments: (_obj, { root }) => {
    return db.comment.findMany({
      where: { authorId: root.id, parentId: null },
      orderBy: { createdAt: 'asc' },
      select: commentSelect,
    })
  },

  posts: (_obj, { root }) => {
    return db.post.findMany({
      where: { authorId: root.id },
      orderBy: { createdAt: 'desc' },
      select: postSelect,
    })
  },
  followsGiven: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).followsGiven()
  },
  followsReceived: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).followsReceived()
  },
  postLikes: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).postLikes()
  },
  commentLikes: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).commentLikes()
  },
}
