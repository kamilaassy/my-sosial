export const schema = gql`
  type CommentLike {
    id: Int!
    userId: Int!
    commentId: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type ToggleCommentLikeResponse {
    liked: Boolean!
    totalLikes: Int!
  }

  type Query {
    commentLikes(commentId: Int!): [CommentLike!]! @requireAuth
    commentLike(id: Int!): CommentLike @requireAuth
  }

  input CreateCommentLikeInput {
    commentId: Int!
  }

  type Mutation {
    createCommentLike(input: CreateCommentLikeInput!): CommentLike! @requireAuth
    deleteCommentLike(id: Int!): CommentLike! @requireAuth
    toggleCommentLike(commentId: Int!): ToggleCommentLikeResponse! @requireAuth
  }
`
