import type { GetPosts, GetPost } from 'types/graphql'

// Post untuk Feed (GET_POSTS)
export type FeedPost = GetPosts['posts'][number]
export type FeedComment = FeedPost['comments'][number]

// Post detail (GET_POST)
export type DetailedPost = GetPost['post']
export type DetailedComment = GetPost['post']['comments'][number]
