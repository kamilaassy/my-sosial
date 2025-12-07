export const UPDATE_POST_MUTATION = gql`
  mutation UpdatePost($id: Int!, $input: UpdatePostInput!) {
    updatePost(id: $id, input: $input) {
      id
      content
      imageUrl
      user {
        id
        name
        avatarUrl
      }
      comments {
        id
      }
      postLikes {
        id
        userId
      }
    }
  }
`
