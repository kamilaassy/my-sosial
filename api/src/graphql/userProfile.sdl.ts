import { gql } from 'graphql-tag'

export const schema = gql`
  type UserProfile {
    id: Int!
    name: String
    email: String!
    bio: String
    avatarUrl: String
    createdAt: DateTime!
    followers: Int!
    following: Int!
    posts: Int!
    isBanned: Boolean!

    # Tambahan untuk fitur block:
    isBlockedByMe: Boolean!
    hasBlockedMe: Boolean!
  }

  type ToggleFollowResponse {
    followed: Boolean!
  }

  type Mutation {
    toggleFollow(targetUserId: Int!): ToggleFollowResponse! @requireAuth
    updateUserProfile(input: UpdateUserProfileInput!): UserProfile! @requireAuth
  }

  input UpdateUserProfileInput {
    name: String
    bio: String
    avatarUrl: String
  }

  type Query {
    userProfile(id: Int!): UserProfile! @skipAuth
    userPosts(userId: Int!): [Post!]! @skipAuth
    isFollowing(targetUserId: Int!): Boolean! @requireAuth
  }
`
