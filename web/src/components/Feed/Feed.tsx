import { useState, useEffect } from 'react'

import { Center, Loader } from '@mantine/core'
import { openConfirmModal } from '@mantine/modals'

import { routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'
import CreatePostTrigger from 'src/components/PostComposer/CreatePostTrigger'
import { usePostComposer } from 'src/components/PostComposer/PostComposerContext'
import PostModal from 'src/components/PostModal/PostModal'
import { EditPostModal } from 'src/components/ui/EditPostModal'
import { FeedCard } from 'src/components/ui/FeedCard'
import { FeedSkeleton } from 'src/components/ui/FeedSkeleton'
import { PageContainer } from 'src/components/ui/PageContainer'
import { UPDATE_POST_MUTATION } from 'src/graphql/updatePost'
import { usePostsFeed } from 'src/hooks/usePostsFeed'
import type { FeedPostDTO } from 'src/types/feed'

export default function Feed() {
  const { currentUser, isAuthenticated, loading: authLoading } = useAuth()
  const { open: openComposer } = usePostComposer()

  const {
    posts,
    setPosts,
    openedPostId,
    setOpenedPostId,
    loading,
    isFetchingMore,
    deletePost,
    togglePostLike,
    refreshPosts, // 🔥 penting
  } = usePostsFeed()

  const [editOpened, setEditOpened] = useState(false)
  const [editPostData, setEditPostData] = useState<FeedPostDTO | null>(null)

  const [updatePost] = useMutation(UPDATE_POST_MUTATION, {
    onError: (err) => toast.error(err.message),
  })

  /* ======================================================
     REDIRECT IF NOT LOGGED IN
  ====================================================== */
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate(routes.login())
    }
  }, [authLoading, isAuthenticated])

  if (authLoading) {
    return (
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    )
  }

  if (!isAuthenticated) return null

  return (
    <PageContainer>
      {/* CREATE POST */}
      <CreatePostTrigger
        onClick={() =>
          openComposer((newPost) => {
            // ⬅️ instant optimistic insert
            setPosts((prev) => [newPost, ...prev])
          })
        }
      />

      {/* FIRST LOAD SKELETON */}
      {loading && posts.length === 0 && (
        <>
          <FeedSkeleton />
          <FeedSkeleton />
          <FeedSkeleton />
        </>
      )}

      {/* POSTS */}
      {posts.map((post) => {
        const likes = post.postLikes.length
        const isLiked = post.postLikes.some((l) => l.userId === currentUser?.id)

        return (
          <FeedCard
            key={post.id}
            userId={post.user.id}
            username={post.user.email}
            avatarUrl={post.user.avatarUrl || undefined}
            content={post.content || ''}
            imageUrl={post.imageUrl || undefined}
            createdAt={post.createdAt}
            likes={likes}
            isLiked={isLiked}
            comments={post.comments.length}
            isOwner={post.user.id === currentUser?.id}
            /* ================= LIKE ================= */
            onLike={async () => {
              await togglePostLike({ variables: { postId: post.id } })
              refreshPosts()
            }}
            /* ================= COMMENT ================= */
            onComment={() => setOpenedPostId(post.id)}
            /* ================= EDIT ================= */
            onEdit={() => {
              setEditPostData(post)
              setEditOpened(true)
            }}
            /* ================= DELETE ================= */
            onDelete={() =>
              openConfirmModal({
                title: 'Delete Post',
                children: 'Are you sure you want to delete this post?',
                labels: { confirm: 'Delete', cancel: 'Cancel' },
                confirmProps: { color: 'red' },
                overlayProps: { blur: 4, backgroundOpacity: 0.55 },
                onConfirm: async () => {
                  await deletePost({ variables: { id: post.id } })
                  refreshPosts()
                },
              })
            }
          />
        )
      })}

      {/* INFINITE SCROLL LOADING */}
      {isFetchingMore && (
        <Center my="lg">
          <Loader size="sm" />
        </Center>
      )}

      {/* POST DETAIL MODAL */}
      <PostModal
        postId={openedPostId}
        opened={!!openedPostId}
        onClose={() => {
          setOpenedPostId(null)
          refreshPosts()
        }}
      />

      {/* EDIT MODAL */}
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
            onCompleted: () => {
              refreshPosts()
              setEditOpened(false)
              toast.success('Post updated!')
            },
          })
        }}
      />
    </PageContainer>
  )
}
