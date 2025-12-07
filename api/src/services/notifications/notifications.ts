import { requireCurrentUser } from 'src/lib/currentUser'
import { db } from 'src/lib/db'

/* ======================================================
 * GET LIST OF NOTIFICATIONS
 * ====================================================== */
export const notifications = async (_args, { context }) => {
  const user = requireCurrentUser(context)

  return db.notification.findMany({
    where: { toUserId: user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      fromUser: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          email: true,
        },
      },
    },
  })
}

/* ======================================================
 * COUNT UNREAD NOTIFICATIONS
 * ====================================================== */
export const unreadNotificationsCount = async (_args, { context }) => {
  const user = requireCurrentUser(context)

  return db.notification.count({
    where: {
      toUserId: user.id,
      isRead: false,
    },
  })
}

/* ======================================================
 * MARK A SINGLE NOTIFICATION READ
 * ====================================================== */
export const markNotificationRead = async ({ id }, { context }) => {
  const user = requireCurrentUser(context)

  const notif = await db.notification.findUnique({ where: { id } })

  if (!notif || notif.toUserId !== user.id) {
    throw new Error('Not authorized')
  }

  return db.notification.update({
    where: { id },
    data: { isRead: true },
  })
}

/* ======================================================
 * MARK ALL NOTIFICATIONS READ
 * ====================================================== */
export const markAllNotificationsRead = async (_args, { context }) => {
  const user = requireCurrentUser(context)

  const result = await db.notification.updateMany({
    where: {
      toUserId: user.id,
      isRead: false,
    },
    data: { isRead: true },
  })

  return result.count
}

export const Notification = {
  fromUser: (_obj, { root }) =>
    db.notification.findUnique({ where: { id: root.id } }).fromUser(),

  post: (_obj, { root }) =>
    root.postId
      ? db.notification.findUnique({ where: { id: root.id } }).post()
      : null,
}
