export const schema = gql`
  # --- Shared Types ---
  type AuthorEmbed {
    id: Int!
    name: String
    email: String!
    avatarUrl: String
  }

  type CommentLikeEmbed {
    id: Int!
    userId: Int!
  }

  # --- Reply defined ONLY HERE ---
  type Reply {
    id: Int!
    content: String!
    postId: Int!
    authorId: Int!
    parentId: Int
    createdAt: DateTime!
    updatedAt: DateTime!

    author: AuthorEmbed
    commentLikes: [CommentLikeEmbed!]!
  }

  # --- Comment type ---
  type Comment {
    id: Int!
    content: String!
    postId: Int!
    authorId: Int!
    parentId: Int
    createdAt: DateTime!
    updatedAt: DateTime!

    author: AuthorEmbed
    commentLikes: [CommentLikeEmbed!]!
    replies: [Reply!]!
  }

  # --- Query & Mutation ---
  type Query {
    comments(postId: Int!): [Comment!]! @requireAuth
    comment(id: Int!): Comment @requireAuth
  }

  input CreateCommentInput {
    content: String!
    postId: Int!
    parentId: Int
  }

  input UpdateCommentInput {
    content: String
  }

  type Mutation {
    createComment(input: CreateCommentInput!): Comment! @requireAuth
    updateComment(id: Int!, input: UpdateCommentInput!): Comment! @requireAuth
    deleteComment(id: Int!): Comment! @requireAuth
  }
`
