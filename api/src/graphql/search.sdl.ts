import { gql } from 'graphql-tag'

export const schema = gql`
  type SearchUserResult {
    id: Int!
    name: String
    email: String!
    avatarUrl: String
  }

  type Query {
    searchUsers(query: String!, skip: Int, take: Int): [SearchUserResult!]!
      @requireAuth
  }
`
