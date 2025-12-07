export const schema = gql`
  type WeeklyTrend {
    label: String!
    posts: Int!
  }

  type RecentPost {
    id: Int!
    content: String
    imageUrl: String
    createdAt: DateTime!
    likeCount: Int!
    commentCount: Int!
  }

  type UserActivity {
    userId: Int!
    postsCount: Int!
    postLikesCount: Int!
    commentsCount: Int!
    commentLikesCount: Int!

    postLikesReceived: Int!
    commentLikesReceived: Int!
    engagementRate: Int!

    recentPosts: [RecentPost!]!
    weeklyTrend: [WeeklyTrend!]!
  }

  # SAFE USER LIST FOR ADMIN
  type AdminUser {
    id: Int!
    email: String!
    name: String
    role: String!
    isBanned: Boolean!
    createdAt: DateTime!
  }

  extend type Query {
    adminUsers: [AdminUser!]! @requireAuth(roles: ["admin"])
    getUserActivity(userId: Int!): UserActivity @requireAuth(roles: ["admin"])
  }

  extend type Mutation {
    banUser(userId: Int!): AdminUser! @requireAuth(roles: ["admin"])
    unbanUser(userId: Int!): AdminUser! @requireAuth(roles: ["admin"])
  }
`
