import { gql } from 'graphql-tag'

export const GET_ADMIN_REPORTS = gql`
  query AdminReports($status: ReportStatus) {
    adminReports(status: $status) {
      id
      reporterId
      reportedId
      reason
      details
      status
      createdAt
      reporter {
        id
        name
        email
      }
      reported {
        id
        name
        email
      }
      post {
        id
        content
      }
    }
  }
`

export const RESOLVE_REPORT = gql`
  mutation ResolveReport($id: Int!, $action: String!) {
    resolveReport(id: $id, action: $action)
  }
`

export const ADMIN_BLOCK_USER = gql`
  mutation AdminBlockUser($userId: Int!) {
    adminBlockUser(userId: $userId) {
      id
      isBanned
    }
  }
`
