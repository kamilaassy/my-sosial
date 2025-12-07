import { gql } from 'graphql-tag'

export const UPLOAD_AVATAR = gql`
  mutation UploadAvatarMutation($file: Upload!) {
    uploadAvatar(file: $file) {
      url
    }
  }
`
export const CREATE_POST_MUTATION = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      id
    }
  }
`
