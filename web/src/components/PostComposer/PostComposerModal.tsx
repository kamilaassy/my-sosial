import { useState } from 'react'

import {
  Modal,
  Group,
  Avatar,
  Textarea,
  ActionIcon,
  Image,
  Stack,
  useMantineColorScheme,
  Text,
} from '@mantine/core'
import { IconPhoto, IconSend, IconX } from '@tabler/icons-react'

import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'
import { Button } from 'src/components/ui/Button'
import { CREATE_POST_MUTATION } from 'src/graphql/upload'

import { usePostComposer } from './PostComposerContext'

export default function PostComposerModal() {
  const { opened, close, onPosted } = usePostComposer()
  const { currentUser } = useAuth()
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'

  const [content, setContent] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const [imageBase64, setImageBase64] = useState<string | null>(null)

  /* =========================
     GLASS (BLUR YES, SHADOW NO)
     ========================= */
  const glassBg = isDark ? 'rgba(28,28,36,0.75)' : 'rgba(255,255,255,0.78)'

  const glassBorder = isDark
    ? '1px solid rgba(255,255,255,0.08)'
    : '1px solid rgba(0,0,0,0.08)'

  const softBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'

  const textColor = isDark ? 'rgba(255,255,255,0.92)' : 'rgba(0,0,0,0.88)'

  const iconColor = isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)'
  /* ========================= */

  const [createPost, { loading }] = useMutation(CREATE_POST_MUTATION, {
    onCompleted: (data) => {
      onPosted?.(data.createPost)
      toast.success('Posted!')
      setContent('')
      setPreview(null)
      setImageBase64(null)
      close()
    },
    onError: (err) => toast.error(err.message),
  })

  const handleImageSelect = (file: File | null) => {
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
      setImageBase64(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handlePost = () => {
    if (!content.trim() && !imageBase64) {
      toast.error('Write something or add an image')
      return
    }

    createPost({
      variables: {
        input: { content, imageBase64 },
      },
    })
  }

  const avatarSrc =
    typeof currentUser?.avatarUrl === 'string'
      ? currentUser.avatarUrl
      : undefined

  return (
    <Modal
      opened={opened}
      onClose={close}
      centered
      size="md"
      withCloseButton={false}
      overlayProps={{
        blur: 8, // ✅ BLUR TETAP ADA
        backgroundOpacity: 0.4,
      }}
      styles={{
        content: {
          background: glassBg,
          backdropFilter: 'blur(14px)', // ✅ BLUR CARD
          border: glassBorder,
          borderRadius: 18,
          boxShadow: 'none', // ❌ SHADOW DIHILANGIN
        },
      }}
    >
      {/* CLOSE */}
      <ActionIcon
        onClick={close}
        radius="xl"
        size={34}
        style={{
          position: 'absolute',
          top: 14,
          right: 14,
          background: softBg,
          color: iconColor,
        }}
      >
        <IconX size={18} />
      </ActionIcon>

      <Stack gap="md">
        {/* HEADER */}
        <Group>
          <Avatar
            src={avatarSrc}
            radius="xl"
            styles={{
              root: {
                background: softBg,
                color: iconColor,
              },
            }}
          />
          <Text fw={600} c={textColor}>
            New Post
          </Text>
        </Group>

        {/* INPUT */}
        <Textarea
          placeholder="What's on your mind?"
          autosize
          minRows={3}
          value={content}
          onChange={(e) => setContent(e.currentTarget.value)}
          styles={{
            input: {
              background: softBg,
              border: glassBorder,
              color: textColor,
              borderRadius: 14,
            },
          }}
        />

        {/* IMAGE PREVIEW */}
        {preview && (
          <div style={{ position: 'relative' }}>
            <Image
              src={preview}
              radius="lg"
              alt="preview"
              style={{ maxHeight: 240, objectFit: 'cover' }}
            />
            <ActionIcon
              radius="xl"
              size={28}
              onClick={() => {
                setPreview(null)
                setImageBase64(null)
              }}
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                background: 'rgba(0,0,0,0.55)',
                color: 'white',
              }}
            >
              <IconX size={14} />
            </ActionIcon>
          </div>
        )}

        {/* ACTIONS */}
        <Group justify="space-between">
          <ActionIcon
            component="label"
            radius="xl"
            size={36}
            style={{
              background: softBg,
              color: iconColor,
            }}
          >
            <IconPhoto size={20} />
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => handleImageSelect(e.target.files?.[0] || null)}
            />
          </ActionIcon>

          <Button
            radius="xl"
            loading={loading}
            rightSection={<IconSend size={14} color="white" />}
            onClick={handlePost}
          >
            Post
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
