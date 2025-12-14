import { gql } from 'graphql-tag'

export const CREATE_POST_MUTATION = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
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
      }
    }
  }
`
