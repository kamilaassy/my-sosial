import { gql } from 'graphql-tag'

export const schema = gql`
  type FollowUser {
    id: Int!
    name: String
    email: String!
    avatarUrl: String
  }

  type Query {
    followers(userId: Int!): [FollowUser!]! @skipAuth
    following(userId: Int!): [FollowUser!]! @skipAuth
  }
`
