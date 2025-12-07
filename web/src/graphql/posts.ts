import gql from 'graphql-tag'

export const GET_POSTS = gql`
  query GetPosts($skip: Int, $take: Int) {
    posts(skip: $skip, take: $take) {
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
