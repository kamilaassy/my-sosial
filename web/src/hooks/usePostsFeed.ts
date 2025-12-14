import { useState, useEffect, useCallback } from 'react'

import type { DeletePost, TogglePostLike } from 'types/graphql'

import { useQuery, useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { DELETE_POST_MUTATION } from 'src/graphql/deletePost'
import { GET_POSTS } from 'src/graphql/posts'
import { TOGGLE_POST_LIKE } from 'src/graphql/togglePostLike'
import type { FeedPostDTO } from 'src/types/feed'
// import type { FeedPost } from 'src/types/posts'

export const usePostsFeed = () => {
  const TAKE = 10

  const [posts, setPosts] = useState<FeedPostDTO[]>([])

  const [openedPostId, setOpenedPostId] = useState<number | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)

  /* ======================================================
     QUERY POSTS
  ====================================================== */
  const { data, loading, error, fetchMore, refetch } = useQuery(GET_POSTS, {
    variables: { skip: 0, take: TAKE },
    fetchPolicy: 'no-cache',
  })

  /* ======================================================
     INITIAL LOAD
  ====================================================== */
  useEffect(() => {
    if (!data?.posts) return

    const normalized: FeedPostDTO[] = data.posts.map((p) => ({
      ...p,
    }))

    const unique = Array.from(
      new Map(normalized.map((p) => [p.id, p])).values()
    )

    setPosts(unique)
  }, [data])

  /* ======================================================
     MANUAL REFRESH
  ====================================================== */
  const refreshPosts = async () => {
    const res = await refetch()
    const fresh = (res.data?.posts ?? []) as FeedPostDTO[]

    const unique = Array.from(new Map(fresh.map((p) => [p.id, p])).values())

    setPosts(unique)
    setHasMore(true)
  }

  /* ======================================================
     INFINITE SCROLL
  ====================================================== */
  const handleScroll = useCallback(() => {
    const reachedBottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 300

    if (!reachedBottom || isFetchingMore || !hasMore) return

    setIsFetchingMore(true)

    fetchMore({
      variables: {
        skip: posts.length,
        take: TAKE,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult || fetchMoreResult.posts.length === 0) {
          setHasMore(false)
          return prev
        }

        return {
          posts: [
            ...prev.posts,
            ...fetchMoreResult.posts.filter(
              (p) => !prev.posts.some((old) => old.id === p.id)
            ),
          ],
        }
      },
    })
      .catch(() => toast.error('Failed loading more posts'))
      .finally(() => setIsFetchingMore(false))
  }, [posts.length, isFetchingMore, hasMore, fetchMore])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  /* ======================================================
     DELETE POST
  ====================================================== */
  const [deletePost] = useMutation<DeletePost>(DELETE_POST_MUTATION, {
    onCompleted: ({ deletePost }) => {
      setPosts((prev) => prev.filter((p) => p.id !== deletePost.id))
      toast.success('Post deleted')
    },
    onError: (err) => toast.error(err.message),
  })

  /* ======================================================
     LIKE / UNLIKE
  ====================================================== */
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
    hasMore,
    deletePost,
    togglePostLike,
    refreshPosts,
  }
}
