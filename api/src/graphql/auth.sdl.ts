export const schema = gql`
  type Mutation {
    forgotPassword(email: String!): Boolean! @skipAuth
    resetPassword(token: String!, newPassword: String!): Boolean! @skipAuth
  }

  type Query {
    validateResetToken(token: String!): Boolean! @skipAuth
  }
`
