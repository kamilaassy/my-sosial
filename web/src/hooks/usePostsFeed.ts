import { useState, useEffect, useCallback } from 'react'

import { DeletePost, TogglePostLike } from 'types/graphql'

import { useQuery, useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { DELETE_POST_MUTATION } from 'src/graphql/deletePost'
import { GET_POSTS } from 'src/graphql/posts'
import { TOGGLE_POST_LIKE } from 'src/graphql/togglePostLike'
import type { FeedPost } from 'src/types/posts'

export const usePostsFeed = () => {
  const TAKE = 10

  const [posts, setPosts] = useState<FeedPost[]>([])
  const [openedPostId, setOpenedPostId] = useState<number | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)

  /** QUERY */
  const { data, loading, error, fetchMore, refetch } = useQuery(GET_POSTS, {
    variables: { skip: 0, take: TAKE },
    fetchPolicy: 'cache-and-network',
  })

  /** INITIAL LOAD */
  useEffect(() => {
    if (data?.posts) {
      const unique = Array.from(
        new Map(data.posts.map((p) => [p.id, p])).values()
      ) as FeedPost[]

      setPosts(unique)
    }
  }, [data])

  /** INFINITE SCROLL HANDLER */
  const handleScroll = useCallback(() => {
    const reachedBottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 300

    if (!reachedBottom || isFetchingMore || !hasMore) return

    setIsFetchingMore(true)

    fetchMore({
      variables: { skip: posts.length, take: TAKE },
    })
      .then((res) => {
        const newPosts = res.data?.posts || []

        if (newPosts.length === 0) {
          setHasMore(false)
          return
        }

        setPosts((prev) => {
          const merged = [...prev, ...newPosts]
          return Array.from(new Map(merged.map((p) => [p.id, p])).values())
        })
      })
      .finally(() => setIsFetchingMore(false))
  }, [posts.length, isFetchingMore, hasMore, fetchMore])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  /** DELETE POST */
  const [deletePost] = useMutation<DeletePost>(DELETE_POST_MUTATION, {
    onCompleted: ({ deletePost }) => {
      setPosts((prev) => prev.filter((p) => p.id !== deletePost.id))
      toast.success('Post deleted')
    },
    onError: (err) => toast.error(err.message),
  })

  /** LIKE / UNLIKE POST */
  const [togglePostLike] = useMutation<TogglePostLike>(TOGGLE_POST_LIKE, {
    onCompleted: ({ togglePostLike }) => {
      const updated = togglePostLike.post
      setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
    },
    onError: (err) => toast.error(err.message),
  })

  return {
    posts,
    setPosts,
    openedPostId,
    setOpenedPostId,
    loading,
    error,
    isFetchingMore,
    refetch,
    deletePost,
    togglePostLike,
  }
}
