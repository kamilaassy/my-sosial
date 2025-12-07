import type { QueryResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const followers: QueryResolvers['followers'] = async ({ userId }) => {
  return db.user.findMany({
    where: {
      followsGiven: {
        some: { followingId: userId },
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
    },
  })
}

export const following: QueryResolvers['following'] = async ({ userId }) => {
  return db.user.findMany({
    where: {
      followsReceived: {
        some: { followerId: userId },
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
    },
  })
}
