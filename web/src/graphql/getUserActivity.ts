import { gql } from 'graphql-tag'

export const GET_USER_ACTIVITY = gql`
  query GetUserActivity($userId: Int!) {
    getUserActivity(userId: $userId) {
      userId
      postsCount
      postLikesCount
      commentsCount
      commentLikesCount

      postLikesReceived
      commentLikesReceived
      engagementRate

      recentPosts {
        id
        content
        imageUrl
        createdAt
        likeCount
        commentCount
      }

      weeklyTrend {
        label
        posts
      }
    }
  }
`
