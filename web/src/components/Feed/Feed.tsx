import { useState, useEffect } from 'react'

import { Center, Loader } from '@mantine/core'
import { openConfirmModal } from '@mantine/modals'

import { routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'
import CreatePostForm from 'src/components/CreatePostForm/CreatePostForm'
import EditPostModal from 'src/components/EditPostModal'
import PostModal from 'src/components/PostModal/PostModal'
import { FeedCard } from 'src/components/ui/FeedCard'
import { FeedSkeleton } from 'src/components/ui/FeedSkeleton'
import { PageContainer } from 'src/components/ui/PageContainer'
import { UPDATE_POST_MUTATION } from 'src/graphql/updatePost'
import { usePostsFeed } from 'src/hooks/usePostsFeed'
import type { FeedPost } from 'src/types/posts'

export default function Feed() {
  const { currentUser, isAuthenticated, loading: authLoading } = useAuth()

  const {
    posts,
    setPosts,
    openedPostId,
    setOpenedPostId,
    loading,
    isFetchingMore,
    refetch,
    deletePost,
    togglePostLike,
  } = usePostsFeed()

  // EDIT POST STATE
  const [editOpened, setEditOpened] = useState(false)
  const [editPostData, setEditPostData] = useState<FeedPost | null>(null)

  // UPDATE POST MUTATION
  const [updatePost] = useMutation(UPDATE_POST_MUTATION, {
    onCompleted: () => toast.success('Post updated!'),
    onError: (err) => toast.error(err.message),
  })

  /* ----------------------------------------------
   * REDIRECT — harus melalui useEffect!
   * ---------------------------------------------- */
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate(routes.login())
    }
  }, [authLoading, isAuthenticated])

  /* ----------------------------------------------
   * AUTH LOADING SCREEN
   * ---------------------------------------------- */
  if (authLoading) {
    return (
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    )
  }

  /* ----------------------------------------------
   * Jika belum authenticated → tunggu redirect
   * ---------------------------------------------- */
  if (!isAuthenticated) return null

  return (
    <PageContainer>
      {/* CREATE POST */}
      <CreatePostForm onSuccess={() => refetch()} />

      {/* INITIAL LOADING */}
      {loading && posts.length === 0 && (
        <>
          <FeedSkeleton />
          <FeedSkeleton />
          <FeedSkeleton />
        </>
      )}

      {/* POSTS LIST */}
      {posts.map((post) => {
        const likes = post.postLikes.length
        const isLiked = post.postLikes.some(
          (l) => l?.userId === currentUser?.id
        )

        return (
          <FeedCard
            key={post.id}
            userId={post.user.id}
            username={post.user.name || post.user.email}
            avatarUrl={post.user.avatarUrl || undefined}
            content={post.content || ''}
            imageUrl={post.imageUrl || undefined}
            createdAt={post.createdAt}
            likes={likes}
            isLiked={isLiked}
            comments={post.comments.length}
            onLike={() =>
              togglePostLike({
                variables: { postId: post.id },
              })
            }
            onComment={() => setOpenedPostId(post.id)}
            isOwner={post.user.id === currentUser?.id}
            onEdit={() => {
              setEditPostData(post)
              setEditOpened(true)
            }}
            onDelete={() =>
              openConfirmModal({
                title: 'Delete Post',
                children: 'Are you sure you want to delete this post?',
                labels: { confirm: 'Delete', cancel: 'Cancel' },
                confirmProps: { color: 'red' },
                overlayProps: { blur: 4, backgroundOpacity: 0.55 },
                onConfirm: () => deletePost({ variables: { id: post.id } }),
                classNames: {
                  root: 'confirm-delete-modal',
                },
              })
            }
          />
        )
      })}

      {/* INFINITE SCROLL LOADER */}
      {isFetchingMore && (
        <Center my="lg">
          <Loader size="sm" />
        </Center>
      )}

      {/* POST MODAL */}
      <PostModal
        postId={openedPostId}
        opened={!!openedPostId}
        onClose={() => setOpenedPostId(null)}
      />

      {/* EDIT POST MODAL */}
      <EditPostModal
        opened={editOpened}
        post={editPostData}
        onClose={() => setEditOpened(false)}
        onSave={(newText: string) => {
          if (!editPostData) return

          updatePost({
            variables: {
              id: editPostData.id,
              input: { content: newText },
            },
          })

          // Update local state
          setPosts((prev) =>
            prev.map((p) =>
              p.id === editPostData.id ? { ...p, content: newText } : p
            )
          )
          setEditOpened(false)
        }}
      />
    </PageContainer>
  )
}
