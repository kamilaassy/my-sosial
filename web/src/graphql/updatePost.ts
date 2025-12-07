import { gql } from 'graphql-tag'

export const UPDATE_POST_MUTATION = gql`
  mutation UpdatePostMutation($id: Int!, $input: UpdatePostInput!) {
    updatePost(id: $id, input: $input) {
      id
      content
      imageUrl
      createdAt

      user {
        id
        name
        avatarUrl
        email
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
  }
`
