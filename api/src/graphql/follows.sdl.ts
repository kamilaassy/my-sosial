export const schema = gql`
  type Follow {
    id: Int!
    follower: User!
    followerId: Int!
    following: User!
    followingId: Int!
    createdAt: DateTime!
  }

  type Query {
    follows: [Follow!]! @requireAuth
    follow(id: Int!): Follow @requireAuth
  }

  input CreateFollowInput {
    followerId: Int!
    followingId: Int!
  }

  input UpdateFollowInput {
    followerId: Int
    followingId: Int
  }

  type Mutation {
    createFollow(input: CreateFollowInput!): Follow! @requireAuth
    updateFollow(id: Int!, input: UpdateFollowInput!): Follow! @requireAuth
    deleteFollow(id: Int!): Follow! @requireAuth
  }
`
