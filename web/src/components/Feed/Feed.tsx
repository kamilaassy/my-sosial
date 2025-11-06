import { useState, useEffect, useCallback } from 'react'

import {
  Card,
  Image,
  Text,
  Group,
  Container,
  Loader,
  Center,
  Button,
  Flex,
  useMantineColorScheme,
} from '@mantine/core'
import gql from 'graphql-tag'

import { navigate, routes } from '@redwoodjs/router'
import { useQuery } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import CreatePostForm from 'src/components/CreatePostForm/CreatePostForm'

// GraphQL query
const POSTS_QUERY = gql`
  query PostsQuery($skip: Int, $take: Int) {
    posts(skip: $skip, take: $take) {
      id
      content
      imageUrl
      createdAt
      author {
        id
        name
        email
        avatarUrl
      }
    }
  }
`

export default function Feed() {
  const { colorScheme } = useMantineColorScheme()
  const dark = colorScheme === 'dark'
  const {
    isAuthenticated,
    currentUser,
    loading: authLoading,
    logOut,
  } = useAuth()

  const take = 10
  const [posts, setPosts] = useState<
    {
      id: number
      content: string
      imageUrl?: string
      createdAt: string
      author: {
        id: number
        name: string
        email: string
        avatarUrl?: string
      }
    }[]
  >([])
  const [hasMore, setHasMore] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)

  const { data, loading, error, fetchMore, refetch } = useQuery(POSTS_QUERY, {
    variables: { skip: 0, take },
  })

  // Set data awal
  useEffect(() => {
    if (data?.posts) setPosts(data.posts)
  }, [data])

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
      !isFetchingMore &&
      hasMore
    ) {
      setIsFetchingMore(true)
      fetchMore({
        variables: { skip: posts.length, take },
      })
        .then((res) => {
          const newPosts = res.data?.posts || []
          if (newPosts.length === 0) {
            setHasMore(false)
          } else {
            setPosts((prev) => [...prev, ...newPosts])
          }
        })
        .finally(() => setIsFetchingMore(false))
    }
  }, [isFetchingMore, hasMore, fetchMore, posts.length])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Redirect ke login kalau belum login
  useEffect(() => {
    if (!authLoading && !isAuthenticated) navigate(routes.login())
  }, [authLoading, isAuthenticated])

  // Loading pertama (bukan saat scroll)
  if (authLoading || (loading && posts.length === 0)) {
    return (
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    )
  }

  if (error) {
    return (
      <Center>
        <Text color="red">Error: {error.message}</Text>
      </Center>
    )
  }

  return (
    <Container
      size="sm"
      py="md"
      style={{
        backgroundColor: dark ? '#1A1B1E' : '#f8f9fa',
        borderRadius: 12,
        transition: 'background-color 0.3s ease',
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <Flex justify="space-between" align="center" mb="lg">
        <Text fw={700} size="lg">
          Welcome, {currentUser?.email} 👋
        </Text>
        <Button
          size="xs"
          variant={dark ? 'light' : 'filled'}
          color={dark ? 'gray' : 'dark'}
          onClick={async () => {
            await logOut()
            navigate(routes.login())
          }}
        >
          Logout
        </Button>
      </Flex>

      {/* Form Create Post */}
      <CreatePostForm onSuccess={() => refetch()} />

      {/* List of Posts */}
      {posts.map((post) => (
        <Card
          key={post.id}
          shadow="sm"
          radius="lg"
          withBorder
          mb="md"
          style={{
            backgroundColor: dark ? '#2C2E33' : 'white',
            color: dark ? '#fff' : '#000',
          }}
        >
          {post.imageUrl && (
            <Card.Section>
              <Image src={post.imageUrl} height={200} alt="Post image" />
            </Card.Section>
          )}
          <Group justify="space-between" mt="md" mb="xs">
            <Text fw={600}>{post.author?.name || post.author?.email}</Text>
            <Text size="xs" c="dimmed">
              {new Date(post.createdAt).toLocaleString()}
            </Text>
          </Group>
          <Text size="sm" c="dimmed">
            {post.content}
          </Text>
        </Card>
      ))}

      {/* Loader ketika fetching berikutnya */}
      {isFetchingMore && (
        <Center mt="md" mb="md">
          <Loader size="sm" />
        </Center>
      )}

      {/* Pesan kalau tidak ada postingan */}
      {!loading && posts.length === 0 && (
        <Center mt="lg">
          <Text size="sm" c="dimmed">
            No posts yet. Be the first to share something!
          </Text>
        </Center>
      )}
    </Container>
  )
}
