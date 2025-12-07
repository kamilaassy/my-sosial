export const schema = gql`
  input CreateReportInput {
    reportedId: Int!
    reason: String!
    details: String
  }

  type Mutation {
    createReport(input: CreateReportInput!): Report! @requireAuth
  }
`
