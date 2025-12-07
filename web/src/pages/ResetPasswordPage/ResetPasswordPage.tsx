import { useState, FormEvent } from 'react'

import {
  Paper,
  Text,
  Title,
  PasswordInput,
  Button,
  Stack,
  Loader,
  Center,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'

import { useLocation, navigate, routes } from '@redwoodjs/router'
import { useQuery, useMutation } from '@redwoodjs/web'

import { RESET_PASSWORD_MUTATION } from 'src/graphql/ResetPasswordMutation'
import { VALIDATE_RESET_TOKEN_QUERY } from 'src/graphql/ValidateResetTokenQuery'

const ResetPasswordPage = () => {
  const searchParams = new URLSearchParams(useLocation().search)
  const token = searchParams.get('token') || ''

  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)

  const { data, loading: validating } = useQuery(VALIDATE_RESET_TOKEN_QUERY, {
    variables: { token },
    skip: !token,
  })

  const [resetPassword, { loading: resetting }] = useMutation(
    RESET_PASSWORD_MUTATION,
    {
      onCompleted: () => {
        notifications.show({
          title: 'Success',
          message: 'Password successfully changed! Redirecting to login...',
          color: 'green',
        })

        setTimeout(() => navigate(routes.login()), 1500)
      },

      onError: (err) =>
        notifications.show({
          title: 'Error',
          message: err.message,
          color: 'red',
        }),
    }
  )

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    if (newPassword !== confirm) {
      setError('Password confirmation does not match.')
      return
    }

    resetPassword({
      variables: { token, newPassword },
    })
  }

  if (!token) {
    return (
      <Center h={200}>
        <Text>Token not found in URL.</Text>
      </Center>
    )
  }

  if (validating) {
    return (
      <Center h={200}>
        <Loader />
        <Text ml={10}>Validating token...</Text>
      </Center>
    )
  }

  if (data && !data.validateResetToken) {
    return (
      <Center h={200}>
        <Stack align="center">
          <Text color="red">Token is invalid or has expired.</Text>
          <Button
            variant="dark"
            color="indigo"
            onClick={() => navigate(routes.forgotPassword())}
          >
            Create New Token
          </Button>
        </Stack>
      </Center>
    )
  }

  return (
    <Center
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #eef2ff 0%, #fdf2f8 100%)',
      }}
    >
      <Paper
        withBorder
        shadow="md"
        radius="md"
        p="xl"
        mt={60}
        style={{ width: 380 }}
      >
        <Stack gap="lg">
          <div>
            <Title order={3} style={{ textAlign: 'center' }}>
              Reset Password
            </Title>
            <Text ta="center" size="sm" color="dimmed">
              Enter a new secure password
            </Text>
          </div>

          <form onSubmit={submit}>
            <Stack gap="md">
              <PasswordInput
                label="Password Baru"
                value={newPassword}
                onChange={(e) => setNewPassword(e.currentTarget.value)}
                required
                radius="md"
              />

              <PasswordInput
                label="Confirm Password"
                value={confirm}
                onChange={(e) => setConfirm(e.currentTarget.value)}
                required
                radius="md"
              />

              {error && (
                <Text size="sm" color="red">
                  {error}
                </Text>
              )}

              <Button
                fullWidth
                type="submit"
                loading={resetting}
                radius="md"
                color="indigo"
              >
                {resetting ? 'Processing...' : 'Change Password'}
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Center>
  )
}

export default ResetPasswordPage
