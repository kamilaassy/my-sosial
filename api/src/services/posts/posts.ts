import type { QueryResolvers, MutationResolvers } from 'types/graphql'

import { assertNotAdmin } from 'src/lib/authorization'
import { requireCurrentUser } from 'src/lib/currentUser'
import { db } from 'src/lib/db'

// -------------------------------------------------------------
// SELECTOR FIX — hanya ambil top-level comments (parentId=null)
// -------------------------------------------------------------
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
    where: { parentId: null },
    orderBy: { createdAt: 'asc' },
    include: {
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
        include: {
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
} as const

// -------------------------------------------------------------
// GET POST LIST
// -------------------------------------------------------------
export const posts: QueryResolvers['posts'] = ({ skip = 0, take = 10 }) => {
  return db.post.findMany({
    skip,
    take,
    orderBy: { createdAt: 'desc' },
    select: postSelect,
  })
}

// -------------------------------------------------------------
// GET SINGLE POST
// -------------------------------------------------------------
export const post: QueryResolvers['post'] = ({ id }) => {
  return db.post.findUnique({
    where: { id },
    select: postSelect,
  })
}

// -------------------------------------------------------------
// CREATE POST — Admin DIBLOK
// -------------------------------------------------------------
export const createPost: MutationResolvers['createPost'] = (
  { input },
  { context }
) => {
  const user = requireCurrentUser(context)
  assertNotAdmin(user)

  return db.post.create({
    data: {
      content: input.content,
      imageUrl: input.imageUrl,
      authorId: user.id,
    },
    select: postSelect,
  })
}

export const updatePost: MutationResolvers['updatePost'] = ({ id, input }) => {
  return db.post.update({
    where: { id },
    data: input,
    select: postSelect,
  })
}

export const deletePost: MutationResolvers['deletePost'] = async ({ id }) => {
  await db.postLike.deleteMany({ where: { postId: id } })
  await db.comment.deleteMany({ where: { postId: id } })

  return db.post.delete({
    where: { id },
    select: postSelect,
  })
}
