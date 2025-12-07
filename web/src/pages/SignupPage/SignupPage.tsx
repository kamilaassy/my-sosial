import { useEffect, useRef } from 'react'

import {
  Card,
  Container,
  Stack,
  Title,
  Divider,
  useMantineTheme,
  Text,
} from '@mantine/core'

import {
  Form,
  Label,
  TextField,
  PasswordField,
  Submit,
  FieldError,
} from '@redwoodjs/forms'
import { Link, navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { toast, Toaster } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'

const SignupPage = () => {
  const { isAuthenticated, signUp } = useAuth()
  const theme = useMantineTheme()

  const isDark =
    document.documentElement.getAttribute('data-mantine-color-scheme') ===
    'dark'

  useEffect(() => {
    if (isAuthenticated) navigate(routes.home())
  }, [isAuthenticated])

  // auto focus input
  const usernameRef = useRef<HTMLInputElement>(null)
  useEffect(() => usernameRef.current?.focus(), [])

  const onSubmit = async (data: Record<string, string>) => {
    const response = await signUp({
      username: data.username,
      password: data.password,
    })

    if (response.message) toast(response.message)
    else if (response.error) toast.error(response.error)
    else toast.success('Welcome!') // signed in automatically
  }

  // === THEME TOKENS ===
  const cardBg = isDark ? 'rgba(36,26,34,0.58)' : 'rgba(255,255,255,0.72)'
  const borderCol = isDark
    ? theme.colors.purplelux[7]
    : theme.colors.purplelux[2]
  const titleCol = isDark
    ? theme.colors.purplelux[0]
    : theme.colors.purplelux[9]
  const inputBg = isDark ? theme.colors.purplelux[8] : theme.colors.purplelux[0]
  const inputBorder = isDark
    ? theme.colors.purplelux[6]
    : theme.colors.purplelux[3]
  const labelCol = titleCol
  const subtleGlow = isDark
    ? '0 6px 30px rgba(36,26,34,0.35)'
    : '0 6px 30px rgba(160,92,132,0.08)'

  return (
    <>
      <Metadata title="Signup" />

      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />

        <Container
          size="lg"
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <Card
            p={28}
            radius={14}
            withBorder
            shadow="md"
            style={{
              maxWidth: 520,
              minWidth: 420,
              width: '100%',
              minHeight: 360,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              backdropFilter: 'blur(14px)',
              backgroundColor: cardBg,
              borderColor: borderCol,
              boxShadow: subtleGlow,
            }}
          >
            <Stack gap={20}>
              <Title
                ta="center"
                fw={700}
                style={{
                  fontSize: 28,
                  color: titleCol,
                  marginBottom: 6,
                }}
              >
                Create Account
              </Title>

              <Form onSubmit={onSubmit}>
                <Stack gap={16}>
                  {/* USERNAME */}
                  <div>
                    <Label
                      name="username"
                      style={{
                        color: labelCol,
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                    >
                      Username
                    </Label>

                    <TextField
                      name="username"
                      ref={usernameRef}
                      className="rw-input"
                      validation={{
                        required: {
                          value: true,
                          message: 'Username is required',
                        },
                      }}
                      style={{
                        backgroundColor: inputBg,
                        border: `1px solid ${inputBorder}`,
                        padding: '8px 12px',
                        height: 40,
                        borderRadius: 8,
                        marginTop: 8,
                        width: '100%',
                        boxSizing: 'border-box',
                        color: labelCol,
                      }}
                    />
                    <FieldError name="username" />
                  </div>

                  {/* PASSWORD */}
                  <div>
                    <Label
                      name="password"
                      style={{
                        color: labelCol,
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                    >
                      Password
                    </Label>

                    <PasswordField
                      name="password"
                      className="rw-input"
                      autoComplete="new-password"
                      validation={{
                        required: {
                          value: true,
                          message: 'Password is required',
                        },
                      }}
                      style={{
                        backgroundColor: inputBg,
                        border: `1px solid ${inputBorder}`,
                        padding: '8px 12px',
                        height: 40,
                        borderRadius: 8,
                        marginTop: 8,
                        width: '100%',
                        boxSizing: 'border-box',
                        color: labelCol,
                      }}
                    />
                    <FieldError name="password" />
                  </div>

                  {/* SIGN UP BUTTON */}
                  <Submit
                    style={{
                      width: '100%',
                      height: 44,
                      borderRadius: 8,
                      marginTop: 6,
                      fontWeight: 700,
                      backgroundColor: theme.colors.purplelux[4],
                      color: 'white',
                    }}
                  >
                    SIGN UP
                  </Submit>
                </Stack>
              </Form>

              <Divider opacity={0.12} />

              <Text
                ta="center"
                size="sm"
                style={{
                  color: isDark
                    ? theme.colors.purplelux[1]
                    : theme.colors.purplelux[7],
                }}
              >
                Already have an account?{' '}
                <Link to={routes.login()} style={{ fontWeight: 600 }}>
                  Log in
                </Link>
              </Text>
            </Stack>
          </Card>
        </Container>
      </main>
    </>
  )
}

export default SignupPage
