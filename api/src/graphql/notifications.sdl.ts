export const schema = gql`
  type Notification {
    id: Int!
    type: String!
    message: String
    commentText: String
    isRead: Boolean!
    createdAt: DateTime!

    fromUser: UserMinimal!
    toUserId: Int!

    postId: Int
    post: Post
  }

  type Query {
    notifications: [Notification!]! @requireAuth
    unreadNotificationsCount: Int! @requireAuth
  }

  type Mutation {
    markNotificationRead(id: Int!): Notification! @requireAuth
    markAllNotificationsRead: Int! @requireAuth
  }
`
