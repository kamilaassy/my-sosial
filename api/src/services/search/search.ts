import type { QueryResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const searchUsers: QueryResolvers['searchUsers'] = async ({
  query,
  skip = 0,
  take = 10,
}) => {
  const q = query.trim()

  if (q === '') return []

  return db.user.findMany({
    where: {
      role: { not: 'ADMIN' }, // admin tidak muncul
      AND: {
        OR: [
          {
            name: {
              contains: q,
            },
          },
          {
            email: {
              contains: q,
            },
          },
        ],
      },
    },
    skip,
    take,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
    },
  })
}
