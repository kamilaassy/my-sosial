export const POST_WITH_COMMENTS = gql`
  query PostWithComments($id: Int!) {
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

      postLikes {
        id
        userId
      }
    }

    comments: comments(postId: $id) {
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

        commentLikes {
          id
          userId
        }
      }
    }
  }
`
