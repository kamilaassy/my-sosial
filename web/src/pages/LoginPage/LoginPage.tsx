import { useEffect, useRef } from 'react'

import {
  Card,
  Container,
  Stack,
  Title,
  Divider,
  useMantineTheme,
  Text,
  Anchor,
  Box,
} from '@mantine/core'

import {
  Form,
  Label,
  TextField,
  PasswordField,
  Submit,
  FieldError,
} from '@redwoodjs/forms'
import { Link, routes, navigate } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { toast, Toaster } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'

export default function LoginPage() {
  const { isAuthenticated, logIn, currentUser } = useAuth()
  const theme = useMantineTheme()

  // detect dark mode
  const isDark =
    document.documentElement.getAttribute('data-mantine-color-scheme') ===
    'dark'

  /* ==========================================================
     AUTO REDIRECT IF ALREADY LOGGED IN
  ========================================================== */
  useEffect(() => {
    if (!isAuthenticated) return

    if (currentUser?.role === 'admin') navigate(routes.adminDashboard())
    else navigate(routes.home())
  }, [currentUser?.role, isAuthenticated])

  /* ==========================================================
     INPUT AUTOFOCUS
  ========================================================== */
  const usernameRef = useRef<HTMLInputElement>(null)
  useEffect(() => usernameRef.current?.focus(), [])

  /* ==========================================================
     SUBMIT LOGIN
  ========================================================== */
  const onSubmit = async (data: Record<string, string>) => {
    const response = await logIn({
      username: data.username,
      password: data.password,
    })

    if (response.error) {
      toast.error(response.error)
      return
    }

    toast.success('Welcome back!')

    // ⭐ Redirect berdasarkan role dari response
    if (response.user?.role === 'admin') {
      navigate(routes.adminDashboard())
    } else {
      navigate(routes.home())
    }
  }

  /* ==========================================================
     THEME TOKENS (PurpleLux)
  ========================================================== */
  const cardBg = isDark ? 'rgba(36,26,34,0.58)' : 'rgba(255,255,255,0.72)'
  const borderColor = isDark
    ? theme.colors.purplelux[7]
    : theme.colors.purplelux[2]

  const titleCol = isDark
    ? theme.colors.purplelux[0]
    : theme.colors.purplelux[9]

  const inputBg = isDark ? theme.colors.purplelux[8] : theme.colors.purplelux[0]
  const inputBorder = isDark
    ? theme.colors.purplelux[6]
    : theme.colors.purplelux[3]

  const subtleGlow = isDark
    ? '0 6px 30px rgba(36,26,34,0.35)'
    : '0 6px 30px rgba(160,92,132,0.08)'

  /* ==========================================================
     RENDER
  ========================================================== */
  return (
    <>
      <Metadata title="Login" />

      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
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
              borderColor,
              boxShadow: subtleGlow,
            }}
          >
            <Stack gap={18}>
              <Title
                ta="center"
                fw={700}
                style={{ fontSize: 28, color: titleCol, marginBottom: 6 }}
              >
                Welcome Back
              </Title>

              <Form onSubmit={onSubmit}>
                <Stack gap={12}>
                  {/* USERNAME */}
                  <div>
                    <Label
                      name="username"
                      style={{
                        color: titleCol,
                        fontWeight: 600,
                        fontSize: 13,
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
                        color: titleCol,
                        marginTop: 8,
                        width: '100%',
                        boxSizing: 'border-box',
                      }}
                    />

                    <FieldError name="username" />
                  </div>

                  {/* PASSWORD */}
                  <div>
                    <Label
                      name="password"
                      style={{
                        color: titleCol,
                        fontWeight: 600,
                        fontSize: 13,
                      }}
                    >
                      Password
                    </Label>

                    <PasswordField
                      name="password"
                      className="rw-input"
                      autoComplete="current-password"
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
                        color: titleCol,
                        marginTop: 8,
                        width: '100%',
                        boxSizing: 'border-box',
                      }}
                    />

                    <FieldError name="password" />

                    {/* Forgot Password */}
                    <Box
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginTop: 8,
                      }}
                    >
                      <Anchor
                        component="a"
                        href={routes.forgotPassword()}
                        style={{
                          fontSize: 13,
                          color: isDark
                            ? theme.colors.purplelux[1]
                            : theme.colors.purplelux[6],
                          textDecoration: 'underline',
                        }}
                      >
                        Forgot Password?
                      </Anchor>
                    </Box>
                  </div>

                  {/* SUBMIT BUTTON */}
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
                    LOGIN
                  </Submit>
                </Stack>
              </Form>

              <Divider opacity={0.12} />

              {/* SIGNUP LINK */}
              <Text
                ta="center"
                size="sm"
                style={{
                  color: isDark
                    ? theme.colors.purplelux[1]
                    : theme.colors.purplelux[7],
                }}
              >
                Don’t have an account?{' '}
                <Link to={routes.signup()} style={{ fontWeight: 600 }}>
                  Sign up
                </Link>
              </Text>
            </Stack>
          </Card>
        </Container>
      </main>
    </>
  )
}
