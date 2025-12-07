export const schema = gql`
  type WeeklyPost {
    week: String!
    count: Int!
  }

  type AdminStats {
    totalUsers: Int!
    bannedUsers: Int!
    totalReports: Int!
    pendingReports: Int!
    weeklyPosts: [WeeklyPost!]!
  }

  extend type Query {
    adminStats: AdminStats! @requireAuth(roles: ["admin"])
  }
`
