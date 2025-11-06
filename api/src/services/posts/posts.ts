import type {
  QueryResolvers,
  MutationResolvers,
  PostRelationResolvers,
} from 'types/graphql'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

export const posts: QueryResolvers['posts'] = async ({
  skip = 0,
  take = 10,
}: {
  skip?: number
  take?: number
}) => {
  const result = await db.post.findMany({
    orderBy: { createdAt: 'desc' },
    skip,
    take,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
      comments: {
        select: {
          id: true,
          content: true,
          authorId: true,
          createdAt: true,
        },
      },
      likes: {
        select: {
          id: true,
          userId: true,
        },
      },
    },
  })

  // Return as Prisma raw type agar tidak bentrok dengan GraphQL typing
  return result as unknown as ReturnType<QueryResolvers['posts']>
}

export const post: QueryResolvers['post'] = async ({ id }) => {
  const result = await db.post.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
      comments: true,
      likes: true,
    },
  })

  return result as unknown as ReturnType<QueryResolvers['post']>
}

export const createPost: MutationResolvers['createPost'] = async ({
  input,
}) => {
  requireAuth()
  const userId = context.currentUser?.id

  if (!userId) throw new Error('You must be logged in to create a post')

  const result = await db.post.create({
    data: {
      ...input,
      authorId: userId,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
    },
  })

  return result as unknown as ReturnType<MutationResolvers['createPost']>
}

export const updatePost: MutationResolvers['updatePost'] = async ({
  id,
  input,
}) => {
  requireAuth()

  const post = await db.post.findUnique({ where: { id } })
  if (!post) throw new Error('Post not found')
  if (post.authorId !== context.currentUser?.id)
    throw new Error('Not authorized to edit this post')

  const result = await db.post.update({
    data: input,
    where: { id },
  })

  return result as unknown as ReturnType<MutationResolvers['updatePost']>
}

export const deletePost: MutationResolvers['deletePost'] = async ({ id }) => {
  requireAuth()

  const post = await db.post.findUnique({ where: { id } })
  if (!post) throw new Error('Post not found')
  if (post.authorId !== context.currentUser?.id)
    throw new Error('Not authorized to delete this post')

  const result = await db.post.delete({
    where: { id },
  })

  return result as unknown as ReturnType<MutationResolvers['deletePost']>
}

export const Post: PostRelationResolvers = {
  author: (_obj, { root }) =>
    db.post.findUnique({ where: { id: root?.id } }).author(),
  comments: (_obj, { root }) =>
    db.post.findUnique({ where: { id: root?.id } }).comments(),
  likes: (_obj, { root }) =>
    db.post.findUnique({ where: { id: root?.id } }).likes(),
}
