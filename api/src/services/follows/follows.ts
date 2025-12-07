import type {
  QueryResolvers,
  MutationResolvers,
  FollowRelationResolvers,
} from 'types/graphql'

import { ForbiddenError } from '@redwoodjs/graphql-server'

import { requireCurrentUser } from 'src/lib/currentUser'
import { db } from 'src/lib/db'

export const follows: QueryResolvers['follows'] = () => {
  return db.follow.findMany()
}

export const follow: QueryResolvers['follow'] = ({ id }) => {
  return db.follow.findUnique({
    where: { id },
  })
}

/* --------------------------------------------------
 * CREATE FOLLOW — versi aman + notifikasi
 * -------------------------------------------------- */
export const createFollow: MutationResolvers['createFollow'] = async (
  { input },
  { context }
) => {
  const user = requireCurrentUser(context)

  // Block admin
  if (String(user.role).toUpperCase() === 'ADMIN') {
    throw new ForbiddenError(
      'Admin tidak diperbolehkan mengikuti pengguna lain.'
    )
  }

  // Ensure followerId matches current user — prevent spoofing
  if (input.followerId !== user.id) {
    throw new ForbiddenError(
      'followerId must be the current authenticated user'
    )
  }

  // existing logic
  const exists = await db.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: input.followerId,
        followingId: input.followingId,
      },
    },
  })

  if (exists) return exists

  const follow = await db.follow.create({ data: input })

  await db.notification.create({
    data: {
      type: 'FOLLOW',
      fromUserId: input.followerId,
      toUserId: input.followingId,
      message: 'started following you',
    },
  })

  return follow
}

/* --------------------------------------------------
 * UPDATE FOLLOW — (jarang dipakai, tapi aman)
 * -------------------------------------------------- */
export const updateFollow: MutationResolvers['updateFollow'] = ({
  id,
  input,
}) => {
  return db.follow.update({
    data: input,
    where: { id },
  })
}

/* --------------------------------------------------
 * DELETE FOLLOW — untuk unfollow
 * -------------------------------------------------- */
export const deleteFollow: MutationResolvers['deleteFollow'] = async (
  { id },
  { context }
) => {
  const user = requireCurrentUser(context)
  const follow = await db.follow.findUnique({ where: { id } })
  if (!follow) throw new Error('Follow not found')

  if (follow.followerId !== user.id) {
    throw new ForbiddenError('Unauthorized')
  }

  return db.follow.delete({ where: { id } })
}

/* --------------------------------------------------
 * RELATION RESOLVERS
 * -------------------------------------------------- */
export const Follow: FollowRelationResolvers = {
  follower: (_obj, { root }) => {
    return db.follow.findUnique({ where: { id: root?.id } }).follower()
  },
  following: (_obj, { root }) => {
    return db.follow.findUnique({ where: { id: root?.id } }).following()
  },
}
