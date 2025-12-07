import { gql } from 'graphql-tag'

export const SEARCH_USERS = gql`
  query SearchUsers($query: String!, $skip: Int, $take: Int) {
    searchUsers(query: $query, skip: $skip, take: $take) {
      id
      name
      email
      avatarUrl
    }
  }
`
