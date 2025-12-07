export const schema = gql`
  type UserMinimal {
    id: Int!
    name: String
    email: String!
    avatarUrl: String
  }

  type PostLikeMinimal {
    id: Int!
    userId: Int!
  }

  type CommentLikeMinimal {
    id: Int!
    userId: Int!
  }
`
