export type FeedUser = {
  id: number
  name?: string
  email: string
  avatarUrl?: string
}

export type FeedComment = {
  id: number
  content: string
  createdAt: string
  author?: FeedUser
}

export type FeedPostDTO = {
  id: number
  content?: string
  imageUrl?: string
  createdAt: string
  user: FeedUser
  comments: FeedComment[]
  postLikes: { userId: number }[]
}
