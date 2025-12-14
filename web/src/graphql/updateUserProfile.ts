import { gql } from 'graphql-tag'

export const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile($input: UpdateUserProfileInput!) {
    updateUserProfile(input: $input) {
      id
      email
      name
      bio
      avatarUrl
      followers
      following
      posts
      isBlockedByMe
      hasBlockedMe
    }
  }
`
