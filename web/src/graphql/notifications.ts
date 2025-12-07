import { gql } from 'graphql-tag'

/* ================================
 * GET ALL NOTIFICATIONS
 * ================================ */
export const GET_NOTIFICATIONS = gql`
  query GetNotifications {
    notifications {
      id
      type
      isRead
      message
      commentText
      createdAt
      postId

      fromUser {
        id
        name
        avatarUrl
        email
      }
    }
  }
`

/* ================================
 * GET UNREAD COUNT
 * ================================ */
export const GET_UNREAD_COUNT = gql`
  query GetUnreadNotificationsCount {
    unreadNotificationsCount
  }
`

/* ================================
 * MARK ONE AS READ
 * ================================ */
export const MARK_READ = gql`
  mutation MarkNotificationRead($id: Int!) {
    markNotificationRead(id: $id) {
      id
      isRead
    }
  }
`

/* ================================
 * MARK ALL AS READ
 * ================================ */
export const MARK_ALL_READ = gql`
  mutation MarkAllNotificationsAsRead {
    markAllNotificationsRead
  }
`
