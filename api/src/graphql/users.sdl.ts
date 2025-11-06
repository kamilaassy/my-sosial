export const schema = gql`
  type User {
    id: Int!
    email: String!
    hashedPassword: String!
    name: String
    bio: String
    avatarUrl: String
    createdAt: DateTime!
    posts: [Post]!
    comments: [Comment]!
    likes: [Like]!
    followers: [Follow]!
    following: [Follow]!
    role: String!
  }

  type Query {
    users: [User!]! @requireAuth
    user(id: Int!): User @requireAuth
  }

  input CreateUserInput {
    email: String!
    hashedPassword: String!
    name: String
    bio: String
    avatarUrl: String
    role: String!
  }

  input UpdateUserInput {
    email: String
    hashedPassword: String
    name: String
    bio: String
    avatarUrl: String
    role: String
  }

  type Mutation {
    createUser(input: CreateUserInput!): User! @requireAuth
    updateUser(id: Int!, input: UpdateUserInput!): User! @requireAuth
    deleteUser(id: Int!): User! @requireAuth
  }
`
