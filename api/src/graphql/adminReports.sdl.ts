export const schema = gql`
  enum ReportStatus {
    PENDING
    REVIEWED
    ACTION_TAKEN
    DISMISSED
  }

  type Report {
    id: Int!
    reporterId: Int!
    reportedId: Int
    reason: String!
    details: String
    status: ReportStatus!
    createdAt: DateTime!
    reporter: User!
    reported: User
    post: Post
  }

  type Query {
    adminReports(status: ReportStatus): [Report!]!
      @requireAuth(roles: ["admin"])
  }

  type Mutation {
    resolveReport(id: Int!, action: String!): Boolean!
      @requireAuth(roles: ["admin"])
    adminBlockUser(userId: Int!): User! @requireAuth(roles: ["admin"])
  }
`
