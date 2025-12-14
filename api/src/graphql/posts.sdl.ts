export const schema = gql`
  type UserEmbed {
    id: Int!
    name: String
    email: String!
    avatarUrl: String
  }

  type PostLikeEmbed {
    id: Int!
    userId: Int!
  }

  type Post {
    id: Int!
    content: String
    imageUrl: String
    createdAt: DateTime!

    user: UserEmbed!
    comments: [Comment!]!
    postLikes: [PostLikeEmbed!]!
  }

  type Query {
    posts(skip: Int, take: Int): [Post!]! @requireAuth
    post(id: Int!): Post @requireAuth
  }

  input CreatePostInput {
    content: String
    imageUrl: String
    imageBase64: String
  }

  input UpdatePostInput {
    content: String
    imageUrl: String
  }

  type Mutation {
    createPost(input: CreatePostInput!): Post! @requireAuth
    updatePost(id: Int!, input: UpdatePostInput!): Post! @requireAuth
    deletePost(id: Int!): Post! @requireAuth
  }
`
