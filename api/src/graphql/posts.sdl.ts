export const schema = gql`
  type Post {
    id: Int!
    content: String
    imageUrl: String
    author: User!
    authorId: Int!
    createdAt: DateTime!
    comments: [Comment]!
    likes: [Like]!
  }

  type Query {
    posts(skip: Int, take: Int): [Post!]! @requireAuth
    post(id: Int!): Post @requireAuth
  }

  input CreatePostInput {
    content: String
    imageUrl: String
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
