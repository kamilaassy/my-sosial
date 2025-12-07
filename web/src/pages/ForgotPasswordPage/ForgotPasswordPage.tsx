import { useState, FormEvent } from 'react'

import {
  Paper,
  Text,
  Title,
  TextInput,
  Button,
  Stack,
  Center,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'

import { FORGOT_PASSWORD_MUTATION } from 'src/graphql/ForgotPasswordMutation'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const [forgotPassword, { loading }] = useMutation(FORGOT_PASSWORD_MUTATION, {
    onCompleted: () => {
      notifications.show({
        title: 'Success',
        message: 'Token created successfully! Check server console.',
        color: 'green',
      })
      setSent(true)
    },
    onError: () => {
      notifications.show({
        title: 'Info',
        message:
          'If the email is registered, a token has been created. Check the server console.',
        color: 'blue',
      })
      setSent(true)
    },
  })

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!email) return
    forgotPassword({ variables: { email } })
  }

  return (
    <Center>
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
            <Title order={3} ta="center">
              Forgot Password
            </Title>

            <Text ta="center" size="sm" color="dimmed">
              Enter your email / username
            </Text>
          </div>

          {!sent ? (
            <form onSubmit={onSubmit}>
              <Stack gap="md">
                <TextInput
                  label="Email / Username"
                  placeholder="e.g., emscans"
                  value={email}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                  radius="md"
                  required
                />

                <Button
                  fullWidth
                  type="submit"
                  loading={loading}
                  radius="md"
                  color="indigo"
                >
                  {loading ? 'Processing...' : 'Create Token'}
                </Button>
              </Stack>
            </form>
          ) : (
            <Stack gap="md" align="center">
              <Text size="sm" ta="center">
                If the email/username is registered, a token has been created.
                <br />
                Please check the server console:
              </Text>

              <Text
                size="sm"
                ta="center"
                color="indigo"
                style={{ fontFamily: 'monospace' }}
              >
                /reset-password?token=YOUR_TOKEN
              </Text>

              <Button
                variant="dark"
                radius="md"
                color="indigo"
                fullWidth
                onClick={() => navigate(routes.home())}
              >
                Back to Home
              </Button>
            </Stack>
          )}
        </Stack>
      </Paper>
    </Center>
  )
}

export default ForgotPasswordPage
