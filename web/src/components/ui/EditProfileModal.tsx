import { useState, useEffect } from 'react'

import { Modal, TextInput, Textarea, Stack } from '@mantine/core'

import { Button } from './Button'

export const EditProfileModal = ({ opened, onClose, profile, onSave }) => {
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')

  useEffect(() => {
    if (profile) {
      setName(profile.name || '')
      setBio(profile.bio || '')
    }
  }, [profile])

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Edit Profile"
      centered
      radius="lg"
      overlayProps={{ blur: 12, backgroundOpacity: 0.55 }}
    >
      <Stack gap="md">
        <TextInput
          label="Name"
          placeholder="Enter your name"
          withAsterisk
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Textarea
          label="Bio"
          placeholder="Write something about yourself..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          autosize
          minRows={3}
        />

        <Button fullWidth onClick={() => onSave({ name, bio })}>
          Save Changes
        </Button>
      </Stack>
    </Modal>
  )
}
