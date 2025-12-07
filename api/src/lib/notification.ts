import { db } from 'src/lib/db'

export const createNotification = async ({
  type,
  fromUserId,
  toUserId,
  postId = null,
  message = null,
}) => {
  if (fromUserId === toUserId) return null // no self-notif

  return await db.notification.create({
    data: {
      type,
      fromUserId,
      toUserId,
      postId,
      message,
    },
  })
}
