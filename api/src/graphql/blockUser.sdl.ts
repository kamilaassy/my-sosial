export const schema = gql`
  type Mutation {
    blockUser(targetUserId: Int!): Boolean! @requireAuth
  }
`
