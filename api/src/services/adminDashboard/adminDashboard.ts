import { db } from 'src/lib/db'

export const adminStats = async () => {
  // Total users
  const totalUsers = await db.user.count()

  // Total banned users
  const bannedUsers = await db.user.count({
    where: { isBanned: true },
  })

  // Total reports
  const totalReports = await db.report.count()

  // Pending reports
  const pendingReports = await db.report.count({
    where: { status: 'PENDING' },
  })

  // Weekly posts summary
  const weekly = await db.$queryRaw<{ week: string; count: number }[]>`
    SELECT DATE_FORMAT(createdAt, '%Y-%u') AS week, COUNT(*) AS count
    FROM Post
    GROUP BY week
    ORDER BY week DESC
    LIMIT 7
  `

  return {
    totalUsers,
    bannedUsers,
    totalReports,
    pendingReports,
    weeklyPosts: weekly.map((w) => ({
      week: w.week,
      count: Number(w.count),
    })),
  }
}
