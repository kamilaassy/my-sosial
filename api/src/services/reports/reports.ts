import { requireCurrentUser } from 'src/lib/currentUser'
import { db } from 'src/lib/db'

export const createReport = async ({ input }, { context }) => {
  const user = requireCurrentUser(context)

  if (user.id === input.reportedId) {
    throw new Error('You cannot report yourself')
  }

  return db.report.create({
    data: {
      reporterId: user.id,
      reportedId: input.reportedId,
      reason: input.reason,
      details: input.details,
    },
  })
}
