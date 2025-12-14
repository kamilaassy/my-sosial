import { useState, FormEvent } from 'react'

import {
  Box,
  Text,
  Title,
  TextInput,
  Button,
  Stack,
  Center,
  useMantineTheme,
  useMantineColorScheme,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'

import { FORGOT_PASSWORD_MUTATION } from 'src/graphql/ForgotPasswordMutation'

const ForgotPasswordPage = () => {
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'

  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const [forgotPassword, { loading }] = useMutation(FORGOT_PASSWORD_MUTATION, {
    onCompleted: () => {
      notifications.show({
        title: 'Success',
        message: 'If the account exists, a reset token has been generated.',
        color: 'green',
      })
      setSent(true)
    },
    onError: () => {
      notifications.show({
        title: 'Info',
        message:
          'If the email or username is registered, a reset token has been generated.',
        color: 'blue',
      })
      setSent(true)
    },
  })

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    forgotPassword({ variables: { email } })
  }

  /* =========================
     THEME TOKENS
  ========================= */
  const glassBg = isDark ? 'rgba(20,20,28,0.55)' : 'rgba(255,255,255,0.75)'

  const border = isDark
    ? '1px solid rgba(255,255,255,0.12)'
    : '1px solid rgba(0,0,0,0.08)'

  const textMain = isDark
    ? theme.colors.purplelux[0]
    : theme.colors.purplelux[9]

  const textSubtle = isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.6)'

  return (
    <Center style={{ minHeight: '100vh' }}>
      <Box
        style={{
          width: 380,
          padding: 32,
          borderRadius: 20,
          background: glassBg,
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          border,
        }}
      >
        <Stack gap="lg">
          {/* HEADER */}
          <div>
            <Title order={3} ta="center" c={textMain}>
              Forgot Password
            </Title>

            <Text ta="center" size="sm" c={textSubtle} mt={4}>
              Enter your email or username
            </Text>
          </div>

          {/* FORM / RESULT */}
          {!sent ? (
            <form onSubmit={onSubmit}>
              <Stack gap="md">
                <TextInput
                  label="Email / Username"
                  placeholder="e.g. emscans"
                  value={email}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                  radius="md"
                  required
                />

                <Button fullWidth type="submit" loading={loading} radius="md">
                  {loading ? 'Processing...' : 'Create Reset Token'}
                </Button>
              </Stack>
            </form>
          ) : (
            <Stack gap="md" align="center">
              <Text size="sm" ta="center" c={textSubtle}>
                If the account exists, a reset token has been generated.
                <br />
                Check the server console for the link:
              </Text>

              <Text
                size="sm"
                ta="center"
                c={textMain}
                style={{
                  fontFamily: 'monospace',
                  background: isDark
                    ? 'rgba(255,255,255,0.08)'
                    : 'rgba(0,0,0,0.05)',
                  padding: '6px 10px',
                  borderRadius: 8,
                }}
              >
                /reset-password?token=YOUR_TOKEN
              </Text>

              <Button
                variant="subtle"
                radius="md"
                fullWidth
                onClick={() => navigate(routes.home())}
              >
                Back to Home
              </Button>
            </Stack>
          )}
        </Stack>
      </Box>
    </Center>
  )
}

export default ForgotPasswordPage
