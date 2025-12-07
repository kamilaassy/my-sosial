import { ReportStatus } from '@prisma/client'

import { ForbiddenError } from '@redwoodjs/graphql-server'

import { requireCurrentUser } from 'src/lib/currentUser'
import { db } from 'src/lib/db'

export const adminReports = async ({ status }) => {
  // const user = requireCurrentUser(context)

  // if (user.role !== 'admin') {
  //   throw new ForbiddenError('Unauthorized')
  // }

  return db.report.findMany({
    where: status ? { status } : {},
    orderBy: { createdAt: 'desc' },
    include: {
      reporter: true,
      reported: true,
      post: true,
    },
  })
}

export const resolveReport = async ({ id, action }, { context }) => {
  const user = requireCurrentUser(context)

  if (user.role !== 'admin') {
    throw new ForbiddenError('Unauthorized')
  }

  const report = await db.report.findUnique({
    where: { id },
    include: { reported: true },
  })

  if (!report) throw new Error('Report not found')

  // BAN USER
  if (action === 'BAN_USER' && report.reportedId) {
    await db.user.update({
      where: { id: report.reportedId },
      data: { isBanned: true },
    })
  }

  // STATUS CHANGE
  await db.report.update({
    where: { id },
    data: { status: ReportStatus.ACTION_TAKEN },
  })

  return true
}

export const adminBlockUser = async ({ userId }, { context }) => {
  const user = requireCurrentUser(context)

  if (user.role !== 'admin') {
    throw new ForbiddenError('Unauthorized')
  }

  return db.user.update({
    where: { id: userId },
    data: { isBanned: true },
  })
}
