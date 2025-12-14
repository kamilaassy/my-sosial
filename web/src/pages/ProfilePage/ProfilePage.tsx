import { useState } from 'react'

import {
  Center,
  Loader,
  Group,
  Text,
  Title,
  Button,
  useMantineColorScheme,
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

import { useParams, navigate, routes } from '@redwoodjs/router'
import { useQuery, useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'
import { AdminControls } from 'src/components/AdminControl/AdminControl'
import FollowerListModal from 'src/components/FollowerListModal/FollowerListModal'
import PostModal from 'src/components/PostModal/PostModal'
import { ProfileMoreMenu } from 'src/components/ProfileMoreMenu/ProfileMoreMenu'
import { ReportUserModal } from 'src/components/ReportUserModal/ReportUserModal'
// import { Card } from 'src/components/ui/Card'
import { EditPostModal } from 'src/components/ui/EditPostModal'
import { EditProfileModal } from 'src/components/ui/EditProfileModal'
import { FeedCard } from 'src/components/ui/FeedCard'
import { FollowButton } from 'src/components/ui/FollowButton'
import { GlassCard } from 'src/components/ui/GlassCard'
import { PageContainer } from 'src/components/ui/PageContainer'
import { ProfileHeader } from 'src/components/ui/ProfileHeader'
import { DELETE_POST_MUTATION } from 'src/graphql/deletePost'
import { UPDATE_PROFILE } from 'src/graphql/editProfile'
import { GET_FOLLOWERS, GET_FOLLOWING } from 'src/graphql/followers'
import { TOGGLE_POST_LIKE } from 'src/graphql/togglePostLike'
import { UNBLOCK_USER } from 'src/graphql/unblockUser'
import { UPDATE_POST_MUTATION } from 'src/graphql/updatePost'
import { USER_PROFILE_QUERY, TOGGLE_FOLLOW } from 'src/graphql/userProfile'

/* ============================================================
   STAT COMPONENT (GLASS – FINAL)
============================================================ */
const Stat = ({
  label,
  value,
  onClick,
}: {
  label: string
  value: number
  onClick?: () => void
}) => {
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'

  const textMain = isDark
    ? theme.colors.purplelux[0]
    : theme.colors.purplelux[9]

  const textSubtle = isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.55)'

  const hoverBg = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) =>
        onClick && (e.key === 'Enter' || e.key === ' ') && onClick()
      }
      style={{
        textAlign: 'center',
        padding: '10px 18px',
        borderRadius: 14,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'background 0.15s ease, transform 0.1s ease',
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.background = hoverBg
          e.currentTarget.style.transform = 'translateY(-1px)'
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <Text fw={800} size="lg" c={textMain} style={{ lineHeight: 1.2 }}>
        {value}
      </Text>

      <Text size="sm" c={textSubtle}>
        {label}
      </Text>
    </div>
  )
}

/* ============================================================
   PROFILE PAGE
============================================================ */
export default function ProfilePage() {
  const { id } = useParams()
  const userId = Number(id)

  const { currentUser, logOut } = useAuth()

  // const { colorScheme } = useMantineColorScheme()
  // const isDark = colorScheme === 'dark'

  const [followersModal, setFollowersModal] = useState(false)
  const [followingModal, setFollowingModal] = useState(false)

  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [reportTargetId, setReportTargetId] = useState<number | null>(null)

  const [editProfileOpened, editProfileHandlers] = useDisclosure(false)
  const [editPostOpened, editPostHandlers] = useDisclosure(false)
  const [postModalOpened, postModalHandlers] = useDisclosure(false)

  const [selectedPost, setSelectedPost] = useState<
    UserProfileQuery['userPosts'][number] | null
  >(null)

  /* ================= LOAD PROFILE ================= */
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

  /* ================= MUTATIONS ================= */
  const [toggleFollow] = useMutation<ToggleFollowMutation>(TOGGLE_FOLLOW, {
    onCompleted: () => refetch(),
    onError: (err) => toast.error(err.message),
  })

  const [togglePostLike] = useMutation<TogglePostLike>(TOGGLE_POST_LIKE)

  const [deletePost] = useMutation<DeletePost>(DELETE_POST_MUTATION, {
    onCompleted: () => {
      toast.success('Post deleted')
      refetch()
    },
  })

  const [updatePost] = useMutation<UpdatePostMutation>(UPDATE_POST_MUTATION, {
    onCompleted: () => {
      toast.success('Post updated!')
      refetch()
    },
  })

  const [updateProfile] = useMutation<UpdateUserProfileMutation>(
    UPDATE_PROFILE,
    {
      onError: (err) => toast.error(err.message),
    }
  )

  const [unblockUser] = useMutation(UNBLOCK_USER, {
    onCompleted: () => {
      toast.success('User unblocked')
      refetch()
    },
  })

  /* ================= LOADING ================= */
  if (loading || !data) {
    return (
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    )
  }

  const profile = data.userProfile
  const posts = data.userPosts
  const isFollowing = data.isFollowing
  const isMyProfile = currentUser?.id === userId

  const isBlockedByMe = profile.isBlockedByMe
  const hasBlockedMe = profile.hasBlockedMe

  return (
    <PageContainer>
      <ReportUserModal
        opened={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        reportedId={reportTargetId}
      />

      {/* EDIT PROFILE */}
      <EditProfileModal
        opened={editProfileOpened}
        onClose={editProfileHandlers.close}
        profile={profile}
        onSave={async (payload) => {
          const oldEmail = profile.email

          await updateProfile({ variables: { input: payload } })

          editProfileHandlers.close()
          toast.success('Profile updated!')

          if (payload.email && payload.email !== oldEmail) {
            toast.success('Username updated — please log in again.')
            await logOut()
            navigate(routes.login())
          } else {
            refetch()
          }
        }}
      />

      <PostModal
        postId={selectedPost?.id}
        opened={postModalOpened}
        onClose={() => {
          postModalHandlers.close()
          refetch()
        }}
      />

      <EditPostModal
        opened={editPostOpened}
        onClose={editPostHandlers.close}
        post={selectedPost}
        onSave={(newContent) => {
          if (!selectedPost) return
          updatePost({
            variables: { id: selectedPost.id, input: { content: newContent } },
          }).then(editPostHandlers.close)
        }}
      />

      <ProfileHeader
        username={profile.email}
        name={profile.name}
        bio={profile.bio}
        avatarUrl={profile.avatarUrl || undefined}
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

      {currentUser?.role === 'admin' && (
        <AdminControls userId={userId} isBanned={profile.isBanned} />
      )}

      {/* STATS */}
      <GlassCard
        padding="md"
        radius="lg"
        mb="lg"
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <Group justify="center" gap={40}>
          <Stat label="Posts" value={profile.posts} />

          <Stat
            label="Followers"
            value={profile.followers}
            onClick={() => setFollowersModal(true)}
          />

          <Stat
            label="Following"
            value={profile.following}
            onClick={() => setFollowingModal(true)}
          />
        </Group>
      </GlassCard>

      {/* FOLLOW / BLOCK */}
      {isMyProfile ? (
        <Button fullWidth mb="lg" onClick={editProfileHandlers.open}>
          Edit Profile
        </Button>
      ) : isBlockedByMe ? (
        <Button
          fullWidth
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

      <Title order={4} mb="md" c="purplelux.9">
        Posts
      </Title>

      {posts.length === 0 ? (
        <Text ta="center" c="purplelux.6">
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
              username={post.user.email || ''}
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
                  children: <Text size="sm">Delete this post?</Text>,
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
