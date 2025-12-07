import { context } from '@redwoodjs/graphql-server'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

export const unblockUser = async ({ targetUserId }) => {
  await requireAuth()
  const currentUserId = context.currentUser.id

  if (currentUserId === targetUserId) {
    throw new Error("You can't unblock yourself.")
  }

  await db.block.deleteMany({
    where: {
      blockerId: currentUserId,
      blockedId: targetUserId,
    },
  })

  return true
}
