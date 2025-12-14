import { useState, useEffect } from 'react'

import {
  Modal,
  TextInput,
  Textarea,
  Stack,
  Group,
  Avatar,
  ActionIcon,
  useMantineColorScheme,
} from '@mantine/core'
import { IconCamera, IconX } from '@tabler/icons-react'

import { Button } from './Button'
import { GlassCard } from './GlassCard'

/* ===============================
   FILE → BASE64 HELPER
================================ */
const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

export const EditProfileModal = ({ opened, onClose, profile, onSave }) => {
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null)

  /* ===============================
     INIT DATA
  ================================ */
  useEffect(() => {
    if (profile) {
      setEmail(profile.email || '')
      setName(profile.name || '')
      setBio(profile.bio || '')
      setAvatarPreview(profile.avatarUrl || null)
      setAvatarBase64(null)
    }
  }, [profile])

  /* ===============================
     AVATAR PICK
  ================================ */
  const handleAvatarPick = async (file: File | null) => {
    if (!file) return
    if (!file.type.startsWith('image/')) return

    const base64 = await fileToBase64(file)
    setAvatarPreview(base64)
    setAvatarBase64(base64)
  }

  /* ===============================
     SAVE
  ================================ */
  const handleSave = () => {
    onSave({
      email,
      name,
      bio,
      avatarBase64: avatarBase64 || undefined,
    })
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      withCloseButton={false}
      title={null}
      styles={{
        content: {
          background: 'transparent',
          padding: 0,
          boxShadow: 'none',
        },
        header: { display: 'none' },
        body: { padding: 0 },
      }}
    >
      <GlassCard
        radius="lg"
        padding="lg"
        style={{
          background: isDark ? 'rgba(34,34,34,0.82)' : 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(16px)',
          border: isDark
            ? '1px solid rgba(255,255,255,0.12)'
            : '1px solid rgba(0,0,0,0.08)',
          boxShadow: 'none', // ❗️no shadow
          position: 'relative',
        }}
      >
        {/* CLOSE */}
        <ActionIcon
          onClick={onClose}
          radius="md"
          size={32}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
          }}
        >
          <IconX size={16} />
        </ActionIcon>

        <Stack gap="md">
          {/* AVATAR */}
          <Group justify="center">
            <div style={{ position: 'relative' }}>
              <Avatar src={avatarPreview || undefined} size={96} radius="xl" />

              <ActionIcon
                component="label"
                radius="md"
                size={32}
                style={{
                  position: 'absolute',
                  bottom: -4,
                  right: -4,
                  background: isDark
                    ? 'rgba(255,255,255,0.08)'
                    : 'rgba(0,0,0,0.05)',
                }}
              >
                <IconCamera size={16} />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) =>
                    handleAvatarPick(e.currentTarget.files?.[0] || null)
                  }
                />
              </ActionIcon>
            </div>
          </Group>

          {/* USERNAME */}
          <TextInput
            label="Username"
            placeholder="username_without_spaces"
            withAsterisk
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            pattern="^[A-Za-z0-9._-]{3,20}$"
            error={
              email && !/^[A-Za-z0-9._-]{3,20}$/.test(email)
                ? 'Only letters, numbers, dot, underscore, dash'
                : null
            }
          />

          {/* NAME */}
          <TextInput
            label="Name"
            placeholder="Your name"
            withAsterisk
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* BIO */}
          <Textarea
            label="Bio"
            placeholder="Write something..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            autosize
            minRows={3}
          />

          <Button fullWidth onClick={handleSave}>
            Save Changes
          </Button>
        </Stack>
      </GlassCard>
    </Modal>
  )
}
