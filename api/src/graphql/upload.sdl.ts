import { gql } from 'graphql-tag'

export const schema = gql`
  scalar Upload

  type UploadResult {
    url: String!
  }

  type Mutation {
    uploadAvatar(file: Upload!): UploadResult! @requireAuth
  }
`
