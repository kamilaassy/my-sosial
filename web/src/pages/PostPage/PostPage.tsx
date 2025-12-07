import { Loader, Center } from '@mantine/core'

import { useParams, navigate, routes } from '@redwoodjs/router'
import { useQuery } from '@redwoodjs/web'

import PostModal from 'src/components/PostModal/PostModal'
import { GET_POST } from 'src/graphql/post'

export default function PostPage() {
  const { id } = useParams()
  const postId = Number(id)

  const { data, loading, error } = useQuery(GET_POST, {
    variables: { id: postId },
    fetchPolicy: 'cache-and-network',
  })

  if (loading) {
    return (
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    )
  }

  if (error || !data?.post) {
    return <div>Post not found.</div>
  }

  const closeModal = () => navigate(routes.home())

  return (
    <PostModal
      postId={postId}
      opened={true}
      onClose={closeModal} // ← X SEKARANG BEKERJA
    />
  )
}
