import { gql } from 'graphql-tag'

export const schema = gql`
  type Mutation {
    unblockUser(targetUserId: Int!): Boolean! @requireAuth
  }
`
