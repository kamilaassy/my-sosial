export const schema = gql`
  type User {
    id: Int!
    email: String!
    hashedPassword: String!
    name: String
    bio: String
    avatarUrl: String
    createdAt: DateTime!
    role: String!
    salt: String!
    resetToken: String # optional
    resetTokenExpiresAt: DateTime

    comments: [Comment]!
    posts: [Post]!
    followsGiven: [Follow]!
    followsReceived: [Follow]!
    postLikes: [PostLike]!
    commentLikes: [CommentLike]!

    isBanned: Boolean!
  }

  type Query {
    users: [User!]! @requireAuth(roles: ["admin", "user"])
    user(id: Int!): User @requireAuth(roles: ["admin", "user"])
  }

  input CreateUserInput {
    email: String!
    hashedPassword: String!
    name: String
    bio: String
    avatarUrl: String
    role: String!
    salt: String!
    resetToken: String
    resetTokenExpiresAt: DateTime
  }

  input UpdateUserInput {
    email: String
    hashedPassword: String
    name: String
    bio: String
    avatarUrl: String
    role: String
    salt: String
    resetToken: String
    resetTokenExpiresAt: DateTime
  }

  input UpdateProfileInput {
    name: String
    bio: String
    avatarBase64: String
  }

  type Mutation {
    createUser(input: CreateUserInput!): User! @requireAuth
    updateUser(id: Int!, input: UpdateUserInput!): User! @requireAuth
    deleteUser(id: Int!): User! @requireAuth
    updateProfile(input: UpdateProfileInput!): User! @requireAuth
  }
`
