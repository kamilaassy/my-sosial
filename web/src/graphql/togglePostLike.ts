export const TOGGLE_POST_LIKE = gql`
  mutation TogglePostLike($postId: Int!) {
    togglePostLike(postId: $postId) {
      post {
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
  }
`
