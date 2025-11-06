import { useState } from 'react'

import { Card, Textarea, Button, Group, TextInput } from '@mantine/core'

import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

const CREATE_POST_MUTATION = gql`
  mutation CreateUserPostMutation($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      content
      imageUrl
      createdAt
    }
  }
`
interface CreatePostFormProps {
  onSuccess?: () => void
}

export default function CreatePostForm({ onSuccess }: CreatePostFormProps) {
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [createPost, { loading }] = useMutation(CREATE_POST_MUTATION, {
    onCompleted: () => {
      toast.success('Post created successfully!')
      setContent('')
      setImageUrl('')
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content) {
      toast.error('Please write something!')
      return
    }

    createPost({
      variables: {
        input: { content, imageUrl },
      },
    })
  }

  return (
    <Card withBorder shadow="sm" radius="md" mb="lg" p="lg">
      <form onSubmit={handleSubmit}>
        <Textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.currentTarget.value)}
          autosize
          minRows={3}
          mb="md"
        />

        <TextInput
          placeholder="Optional: image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.currentTarget.value)}
          mb="md"
        />

        <Group justify="flex-end">
          <Button type="submit" loading={loading}>
            Post
          </Button>
        </Group>
      </form>
    </Card>
  )
}
