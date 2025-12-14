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
  useMantineTheme,
  useComputedColorScheme,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'

import { useLocation, navigate, routes } from '@redwoodjs/router'
import { useQuery, useMutation } from '@redwoodjs/web'

import { RESET_PASSWORD_MUTATION } from 'src/graphql/ResetPasswordMutation'
import { VALIDATE_RESET_TOKEN_QUERY } from 'src/graphql/ValidateResetTokenQuery'

const ResetPasswordPage = () => {
  const theme = useMantineTheme()
  const isDark = useComputedColorScheme() === 'dark'

  const searchParams = new URLSearchParams(useLocation().search)
  const token = searchParams.get('token') || ''

  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)

  /* ================= TOKEN VALIDATION ================= */
  const { data, loading: validating } = useQuery(VALIDATE_RESET_TOKEN_QUERY, {
    variables: { token },
    skip: !token,
  })

  /* ================= MUTATION ================= */
  const [resetPassword, { loading: resetting }] = useMutation(
    RESET_PASSWORD_MUTATION,
    {
      onCompleted: () => {
        notifications.show({
          title: 'Success',
          message: 'Password successfully changed. Redirecting to login…',
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

  /* ================= SUBMIT ================= */
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

  /* ================= STATES ================= */
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
        <Text ml={10}>Validating token…</Text>
      </Center>
    )
  }

  if (data && !data.validateResetToken) {
    return (
      <Center h="100vh">
        <Stack align="center">
          <Text fw={600} c="red">
            Token is invalid or has expired.
          </Text>

          <Button radius="md" onClick={() => navigate(routes.forgotPassword())}>
            Create New Token
          </Button>
        </Stack>
      </Center>
    )
  }

  /* ================= UI ================= */
  return (
    <Center h="100vh">
      <Paper
        radius="xl"
        p="xl"
        style={{
          width: 380,

          background: isDark ? 'rgba(20,20,28,0.55)' : 'rgba(255,255,255,0.65)',

          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',

          border: isDark
            ? '1px solid rgba(255,255,255,0.12)'
            : '1px solid rgba(0,0,0,0.08)',
        }}
      >
        <Stack gap="lg">
          <div>
            <Title
              order={3}
              ta="center"
              c={isDark ? theme.colors.purplelux[0] : theme.colors.purplelux[9]}
            >
              Reset Password
            </Title>

            <Text ta="center" size="sm" c="dimmed">
              Enter a new secure password
            </Text>
          </div>

          <form onSubmit={submit}>
            <Stack gap="md">
              <PasswordInput
                label="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.currentTarget.value)}
                radius="md"
                required
              />

              <PasswordInput
                label="Confirm Password"
                value={confirm}
                onChange={(e) => setConfirm(e.currentTarget.value)}
                radius="md"
                required
              />

              {error && (
                <Text size="sm" c="red">
                  {error}
                </Text>
              )}

              <Button type="submit" fullWidth radius="md" loading={resetting}>
                {resetting ? 'Processing…' : 'Change Password'}
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Center>
  )
}

export default ResetPasswordPage
