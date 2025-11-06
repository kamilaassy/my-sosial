import type {
  QueryResolvers,
  MutationResolvers,
  FollowRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const follows: QueryResolvers['follows'] = () => {
  return db.follow.findMany()
}

export const follow: QueryResolvers['follow'] = ({ id }) => {
  return db.follow.findUnique({
    where: { id },
  })
}

export const createFollow: MutationResolvers['createFollow'] = ({ input }) => {
  return db.follow.create({
    data: input,
  })
}

export const updateFollow: MutationResolvers['updateFollow'] = ({
  id,
  input,
}) => {
  return db.follow.update({
    data: input,
    where: { id },
  })
}

export const deleteFollow: MutationResolvers['deleteFollow'] = ({ id }) => {
  return db.follow.delete({
    where: { id },
  })
}

export const Follow: FollowRelationResolvers = {
  follower: (_obj, { root }) => {
    return db.follow.findUnique({ where: { id: root?.id } }).follower()
  },
  following: (_obj, { root }) => {
    return db.follow.findUnique({ where: { id: root?.id } }).following()
  },
}
