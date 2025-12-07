import { gql } from 'graphql-tag'

export const USER_PROFILE_QUERY = gql`
  query UserProfileQuery($id: Int!) {
    userProfile(id: $id) {
      id
      name
      email
      bio
      avatarUrl
      createdAt
      followers
      following
      posts
      posts
      isBanned
      hasBlockedMe
      isBlockedByMe
    }

    userPosts(userId: $id) {
      id
      content
      imageUrl
      createdAt

      user {
        id
        name
        email
        avatarUrl
      }

      postLikes {
        id
        userId
      }

      comments {
        id
        content
        createdAt
        author {
          id
          name
          email
          avatarUrl
        }
      }
    }

    isFollowing(targetUserId: $id)
  }
`

export const TOGGLE_FOLLOW = gql`
  mutation ToggleFollowMutation($targetUserId: Int!) {
    toggleFollow(targetUserId: $targetUserId) {
      followed
    }
  }
`
