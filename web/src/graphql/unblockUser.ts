import { gql } from 'graphql-tag'

export const UNBLOCK_USER = gql`
  mutation UnblockUser($targetUserId: Int!) {
    unblockUser(targetUserId: $targetUserId)
  }
`
