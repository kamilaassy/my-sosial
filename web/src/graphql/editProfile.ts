import { gql } from 'graphql-tag'

export const UPDATE_PROFILE = gql`
  mutation UpdateUserProfileMutation($input: UpdateUserProfileInput!) {
    updateUserProfile(input: $input) {
      id
      name
      bio
      avatarUrl
      followers
      following
      posts
    }
  }
`
