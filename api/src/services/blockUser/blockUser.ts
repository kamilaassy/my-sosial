import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

export const blockUser = async ({ targetUserId }) => {
  await requireAuth()
  const currentUserId = context.currentUser.id

  if (currentUserId === targetUserId) {
    throw new Error("You can't block yourself.")
  }

  // Hapus hubungan follow kedua arah
  await db.follow.deleteMany({
    where: {
      OR: [
        { followerId: currentUserId, followingId: targetUserId },
        { followerId: targetUserId, followingId: currentUserId },
      ],
    },
  })

  // Simpan blokir
  return db.block.create({
    data: {
      blockerId: currentUserId,
      blockedId: targetUserId,
    },
  })
}
