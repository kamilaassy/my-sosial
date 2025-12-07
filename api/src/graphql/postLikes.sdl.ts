export const schema = gql`
  type PostLike {
    id: Int!
    userId: Int!
    postId: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type TogglePostLikeResponse {
    post: Post! # sesuai return Prisma
  }

  type Query {
    postLikes: [PostLike!]! @requireAuth
    postLike(id: Int!): PostLike @requireAuth
  }

  input CreatePostLikeInput {
    userId: Int!
    postId: Int!
  }

  input UpdatePostLikeInput {
    userId: Int
    postId: Int
  }

  type Mutation {
    createPostLike(input: CreatePostLikeInput!): PostLike! @requireAuth
    updatePostLike(id: Int!, input: UpdatePostLikeInput!): PostLike!
      @requireAuth
    deletePostLike(id: Int!): PostLike! @requireAuth
    togglePostLike(postId: Int!): TogglePostLikeResponse! @requireAuth
  }
`
