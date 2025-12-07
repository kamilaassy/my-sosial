export const GET_POST = gql`
  query GetPost($id: Int!) {
    post(id: $id) {
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
        commentLikes {
          id
          userId
        }
        replies {
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

      postLikes {
        id
        userId
      }
    }
  }
`
