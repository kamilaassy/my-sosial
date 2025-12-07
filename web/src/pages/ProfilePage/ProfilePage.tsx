import { useState } from 'react'

import {
  Center,
  Loader,
  Group,
  Text,
  Title,
  Button,
  useComputedColorScheme,
  useMantineTheme,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import type {
  UserProfileQuery,
  UserProfileQueryVariables,
  ToggleFollowMutation,
  TogglePostLike,
  DeletePost,
  UpdatePostMutation,
  UpdateUserProfileMutation,
} from 'types/graphql'

import { useParams } from '@redwoodjs/router'
import { useQuery, useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'
import { AdminControls } from 'src/components/AdminControl/AdminControl'
import FollowerListModal from 'src/components/FollowerListModal/FollowerListModal'
import PostModal from 'src/components/PostModal/PostModal'
import { ProfileMoreMenu } from 'src/components/ProfileMoreMenu/ProfileMoreMenu'
import { ReportUserModal } from 'src/components/ReportUserModal/ReportUserModal'
import { Card } from 'src/components/ui/Card'
import { EditPostModal } from 'src/components/ui/EditPostModal'
import { EditProfileModal } from 'src/components/ui/EditProfileModal'
import { FeedCard } from 'src/components/ui/FeedCard'
import { FollowButton } from 'src/components/ui/FollowButton'
import { PageContainer } from 'src/components/ui/PageContainer'
import { ProfileHeader } from 'src/components/ui/ProfileHeader'
import { DELETE_POST_MUTATION } from 'src/graphql/deletePost'
import { UPDATE_PROFILE } from 'src/graphql/editProfile'
import { GET_FOLLOWERS, GET_FOLLOWING } from 'src/graphql/followers'
import { TOGGLE_POST_LIKE } from 'src/graphql/togglePostLike'
import { UNBLOCK_USER } from 'src/graphql/unblockUser'
import { UPDATE_POST_MUTATION } from 'src/graphql/updatePost'
import { USER_PROFILE_QUERY, TOGGLE_FOLLOW } from 'src/graphql/userProfile'

/* -----------------------------------------------------
   Reusable Stat Component
----------------------------------------------------- */
const Stat = ({ label, value }: { label: string; value: number }) => {
  const theme = useMantineTheme()
  const isDark = useComputedColorScheme() === 'dark'

  return (
    <div style={{ textAlign: 'center' }}>
      <Text
        fw={700}
        c={isDark ? theme.colors.purplelux[0] : theme.colors.purplelux[9]}
      >
        {value}
      </Text>

      <Text
        size="sm"
        c={isDark ? theme.colors.purplelux[2] : theme.colors.purplelux[6]}
      >
        {label}
      </Text>
    </div>
  )
}

/* -----------------------------------------------------
   PROFILE PAGE
----------------------------------------------------- */
export default function ProfilePage() {
  const [followersModal, setFollowersModal] = useState(false)
  const [followingModal, setFollowingModal] = useState(false)

  const { id } = useParams()
  const userId = Number(id)

  const { currentUser } = useAuth()

  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [reportTargetId, setReportTargetId] = useState<number | null>(null)

  // Modal states
  const [editProfileOpened, editProfileHandlers] = useDisclosure(false)
  const [selectedPost, setSelectedPost] = useState<
    UserProfileQuery['userPosts'][number] | null
  >(null)
  const [postModalOpened, postModalHandlers] = useDisclosure(false)
  const [editPostOpened, editPostHandlers] = useDisclosure(false)

  /* -----------------------------------------------------
     FETCH USER PROFILE DATA
  ----------------------------------------------------- */
  const { data, loading, refetch } = useQuery<
    UserProfileQuery,
    UserProfileQueryVariables
  >(USER_PROFILE_QUERY, {
    variables: { id: userId },
    fetchPolicy: 'cache-and-network',
  })

  const followersQuery = useQuery(GET_FOLLOWERS, {
    variables: { userId },
    skip: !followersModal,
  })

  const followingQuery = useQuery(GET_FOLLOWING, {
    variables: { userId },
    skip: !followingModal,
  })

  /* -----------------------------------------------------
     MUTATIONS
  ----------------------------------------------------- */
  const [toggleFollow] = useMutation<ToggleFollowMutation>(TOGGLE_FOLLOW, {
    onCompleted: () => {
      refetch()
    },
    onError: (err) => toast.error(err.message),
  })

  const [togglePostLike] = useMutation<TogglePostLike>(TOGGLE_POST_LIKE, {
    onError: (err) => toast.error(err.message),
  })

  const [deletePost] = useMutation<DeletePost>(DELETE_POST_MUTATION, {
    onCompleted: () => {
      toast.success('Post deleted')
      refetch()
    },
    onError: (err) => toast.error(err.message),
  })

  const [updatePost] = useMutation<UpdatePostMutation>(UPDATE_POST_MUTATION, {
    onCompleted: () => {
      toast.success('Post updated!')
      refetch()
    },
    onError: (err) => toast.error(err.message),
  })

  const [updateProfile] = useMutation<UpdateUserProfileMutation>(
    UPDATE_PROFILE,
    {
      onCompleted: () => {
        toast.success('Profile updated!')
        refetch()
      },
      onError: (err) => toast.error(err.message),
    }
  )

  const [unblockUser] = useMutation(UNBLOCK_USER, {
    onCompleted: () => {
      toast.success('User unblocked')
      refetch()
    },
    onError: (err) => toast.error(err.message),
  })

  /* -----------------------------------------------------
     LOADING STATES
  ----------------------------------------------------- */
  if (loading || !data) {
    return (
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    )
  }

  /* -----------------------------------------------------
     EXTRACT DATA
  ----------------------------------------------------- */
  const profile = data.userProfile
  const posts = data.userPosts
  const isFollowing = data.isFollowing
  const isMyProfile = currentUser?.id === userId
  const isBlockedByMe = profile.isBlockedByMe
  const hasBlockedMe = profile.hasBlockedMe

  /* -----------------------------------------------------
     RENDER
  ----------------------------------------------------- */
  return (
    <PageContainer>
      <ReportUserModal
        opened={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        reportedId={reportTargetId}
      />

      {/* ----------------------- EDIT PROFILE MODAL ----------------------- */}
      <EditProfileModal
        opened={editProfileOpened}
        onClose={editProfileHandlers.close}
        profile={profile}
        onSave={(payload) =>
          updateProfile({
            variables: { input: payload },
          }).then(() => {
            editProfileHandlers.close()
            // refetch handled by mutation onCompleted
          })
        }
      />

      {/* ----------------------- POST MODAL (COMMENTS) ----------------------- */}
      <PostModal
        postId={selectedPost?.id}
        opened={postModalOpened}
        onClose={() => {
          postModalHandlers.close()
          refetch()
        }}
      />

      {/* ----------------------- EDIT POST MODAL ----------------------- */}
      <EditPostModal
        opened={editPostOpened}
        onClose={editPostHandlers.close}
        post={selectedPost}
        onSave={(newContent) => {
          if (!selectedPost) return

          updatePost({
            variables: {
              id: selectedPost.id,
              input: { content: newContent },
            },
          }).then(() => {
            editPostHandlers.close()
            // refetch handled by mutation onCompleted
          })
        }}
      />

      {/* ----------------------- PROFILE HEADER ----------------------- */}
      <ProfileHeader
        name={profile.name || profile.email}
        bio={profile.bio}
        mb={20}
        rightSection={
          !isMyProfile && (
            <ProfileMoreMenu
              userId={userId}
              onReport={(id) => {
                setReportTargetId(id)
                setReportModalOpen(true)
              }}
              onBlockSuccess={() => refetch()}
            />
          )
        }
      />

      {/* --------------------- ADMIN CONTROLS------------------------ */}
      {currentUser?.role === 'admin' && (
        <AdminControls userId={userId} isBanned={profile.isBanned} />
      )}

      {/* ----------------------- STATS ----------------------- */}
      <Card p="md" mb="lg" withBorder>
        <Group justify="center" gap={40}>
          <Stat label="Posts" value={profile.posts} />
          <div
            role="button"
            tabIndex={0}
            onClick={() => setFollowersModal(true)}
            onKeyDown={(e) =>
              (e.key === 'Enter' || e.key === ' ') && setFollowersModal(true)
            }
            style={{ cursor: 'pointer' }}
          >
            <Stat label="Followers" value={profile.followers} />
          </div>

          <div
            role="button"
            tabIndex={0}
            onClick={() => setFollowingModal(true)}
            onKeyDown={(e) =>
              (e.key === 'Enter' || e.key === ' ') && setFollowingModal(true)
            }
            style={{ cursor: 'pointer' }}
          >
            <Stat label="Following" value={profile.following} />
          </div>
        </Group>
      </Card>

      {/* ---------------- FOLLOW / BLOCK LOGIC ---------------- */}
      {isMyProfile ? (
        <Button
          fullWidth
          radius="md"
          size="md"
          mb="lg"
          onClick={editProfileHandlers.open}
        >
          Edit Profile
        </Button>
      ) : isBlockedByMe ? (
        <Button
          fullWidth
          radius="md"
          size="md"
          mb="lg"
          color="red"
          onClick={() => unblockUser({ variables: { targetUserId: userId } })}
        >
          Unblock
        </Button>
      ) : hasBlockedMe ? (
        <Text ta="center" c="red" fw={600} mb="lg">
          You cannot follow or interact with this user.
        </Text>
      ) : (
        <FollowButton
          following={isFollowing}
          onToggle={() => toggleFollow({ variables: { targetUserId: userId } })}
          mb="lg"
        />
      )}

      <FollowerListModal
        opened={followersModal}
        onClose={() => setFollowersModal(false)}
        title="Followers"
        users={followersQuery.data?.followers || []}
      />

      <FollowerListModal
        opened={followingModal}
        onClose={() => setFollowingModal(false)}
        title="Following"
        users={followingQuery.data?.following || []}
      />

      {/* ----------------------- POSTS TITLE ----------------------- */}
      <Title order={4} mb="md" c="purplelux.9">
        Posts
      </Title>

      {/* ----------------------- POSTS LIST ----------------------- */}
      {hasBlockedMe ? (
        <Text c="purplelux.6" ta="center" fw={500} mt="sm">
          This posts are hidden because they have blocked you.
        </Text>
      ) : posts.length === 0 ? (
        <Text c="purplelux.6" ta="center" fw={500} mt="sm">
          No posts yet.
        </Text>
      ) : (
        posts.map((post) => {
          const isLiked = post.postLikes.some(
            (l) => l.userId === currentUser?.id
          )

          return (
            <FeedCard
              key={post.id}
              userId={post.user.id}
              username={post.user.name || ''}
              avatarUrl={post.user.avatarUrl || undefined}
              content={post.content || ''}
              imageUrl={post.imageUrl || undefined}
              createdAt={post.createdAt}
              likes={post.postLikes.length}
              isLiked={isLiked}
              comments={post.comments.length}
              onLike={() => togglePostLike({ variables: { postId: post.id } })}
              onComment={() => {
                setSelectedPost(post)
                postModalHandlers.open()
              }}
              isOwner={currentUser?.id === post.user.id}
              onDelete={() =>
                modals.openConfirmModal({
                  title: 'Delete Post',
                  centered: true,
                  children: (
                    <Text size="sm">
                      Are you sure you want to delete this post?
                    </Text>
                  ),
                  labels: { confirm: 'Delete', cancel: 'Cancel' },
                  confirmProps: { color: 'red' },
                  onConfirm: () => deletePost({ variables: { id: post.id } }),
                })
              }
              onEdit={() => {
                setSelectedPost(post)
                editPostHandlers.open()
              }}
            />
          )
        })
      )}
    </PageContainer>
  )
}
