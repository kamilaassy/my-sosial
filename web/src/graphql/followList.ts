import { gql } from 'graphql-tag'

export const GET_FOLLOWERS = gql`
  query Followers($userId: Int!) {
    followers(userId: $userId) {
      id
      name
      email
      avatarUrl
    }
  }
`

export const GET_FOLLOWING = gql`
  query Following($userId: Int!) {
    following(userId: $userId) {
      id
      name
      email
      avatarUrl
    }
  }
`
