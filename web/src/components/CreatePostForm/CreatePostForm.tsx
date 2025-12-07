import { useState } from 'react'

import {
  Card,
  Group,
  Textarea,
  ActionIcon,
  Button,
  Avatar,
  useMantineTheme,
  useMantineColorScheme,
} from '@mantine/core'
import { IconPhoto, IconSend } from '@tabler/icons-react'

import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'
import { CREATE_POST_MUTATION } from 'src/graphql/upload'

export default function CreatePostForm({ onSuccess }) {
  const { currentUser } = useAuth()

  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'

  // === MATCH FEED COLORS ===
  const cardBg = isDark ? theme.colors.purplelux[9] : theme.colors.purplelux[0]
  const border = isDark ? theme.colors.purplelux[7] : theme.colors.purplelux[2]
  const textColor = isDark
    ? theme.colors.purplelux[0]
    : theme.colors.purplelux[9]
  const iconColor = isDark
    ? theme.colors.purplelux[4]
    : theme.colors.purplelux[6]

  const [content, setContent] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)

  const [createPost, { loading }] = useMutation(CREATE_POST_MUTATION, {
    onCompleted: () => {
      setContent('')
      setImageFile(null)
      toast.success('Posted!')
      onSuccess?.()
    },
    onError: (err) => toast.error(err.message),
  })

  const handlePost = () => {
    if (!content.trim() && !imageFile) {
      toast.error('Content or image is required')
      return
    }

    createPost({
      variables: {
        input: {
          content,
          imageUrl: imageFile,
        },
      },
    })
  }

  return (
    <Card
      radius="lg"
      p="lg"
      mb="xl"
      withBorder
      style={{
        backgroundColor: cardBg,
        border: `1px solid ${border}`,
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* TOP SECTION */}
      <Group align="flex-start">
        <Avatar
          src={(currentUser?.avatarUrl as string) || undefined}
          radius="xl"
          size="lg"
          styles={{
            root: {
              backgroundColor: isDark
                ? theme.colors.purplelux[5]
                : theme.colors.purplelux[1],
            },
          }}
        />

        <Textarea
          placeholder="What’s on your mind?"
          value={content}
          onChange={(e) => setContent(e.currentTarget.value)}
          autosize
          minRows={2}
          maxRows={5}
          styles={{
            input: {
              background: 'transparent',
              border: 'none',
              color: textColor, // TETAP
              fontSize: 16,
              paddingTop: 10,
              '::placeholder': {
                color: isDark
                  ? theme.colors.purplelux[3]
                  : theme.colors.purplelux[6],
                opacity: 1,
              },
            },
          }}
          style={{ flexGrow: 1 }}
        />
      </Group>

      {/* ACTIONS */}
      <Group justify="space-between" mt="sm">
        <ActionIcon
          radius="xl"
          variant="light"
          size="lg"
          component="label"
          style={{
            backgroundColor: isDark
              ? theme.colors.purplelux[7]
              : theme.colors.purplelux[1],
          }}
        >
          <IconPhoto size={20} color={iconColor} />
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
        </ActionIcon>

        <Button
          radius="xl"
          rightSection={<IconSend size={16} />}
          loading={loading}
          onClick={handlePost}
        >
          Post
        </Button>
      </Group>
    </Card>
  )
}
