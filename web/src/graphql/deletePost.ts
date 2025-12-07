import { gql } from 'graphql-tag'

export const DELETE_POST_MUTATION = gql`
  mutation DeletePost($id: Int!) {
    deletePost(id: $id) {
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

      postLikes {
        id
        userId
      }
    }
  }
`
