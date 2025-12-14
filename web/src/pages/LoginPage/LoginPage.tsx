import { useEffect, useRef, useState } from 'react'

import {
  Stack,
  Title,
  Text,
  Anchor,
  Box,
  ActionIcon,
  useMantineTheme,
} from '@mantine/core'
import { IconEye, IconEyeOff } from '@tabler/icons-react'

import {
  Form,
  Label,
  TextField,
  Submit,
  FieldError,
  PasswordField,
} from '@redwoodjs/forms'
import { Link, routes, navigate } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import { AuthCard } from 'src/components/ui/AuthCard'

export default function LoginPage() {
  const { logIn } = useAuth()
  const theme = useMantineTheme()

  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    emailRef.current?.focus()
  }, [])

  const isDark =
    document.documentElement.getAttribute('data-mantine-color-scheme') ===
    'dark'

  const textMain = isDark
    ? theme.colors.purplelux[0]
    : theme.colors.purplelux[9]

  const textSubtle = isDark
    ? theme.colors.purplelux[2]
    : theme.colors.purplelux[6]

  const onSubmit = async (data: Record<string, string>) => {
    setAuthError(null)

    const res = await logIn({
      username: data.email,
      password: data.password,
    })

    if (res.error) {
      setAuthError(
        'Sorry, your password was incorrect. Please double-check your password.'
      )
      return
    }

    navigate(
      res.user?.role === 'admin' ? routes.adminDashboard() : routes.home()
    )
  }

  return (
    <>
      <Metadata title="Login" />

      <main className="auth-center">
        <AuthCard>
          <Stack align="center" gap={4}>
            <Title fw={700} c={textMain}>
              Welcome back
            </Title>
            <Text size="sm" c={textSubtle}>
              Please enter your details to sign in
            </Text>
          </Stack>

          <Form onSubmit={onSubmit}>
            <Stack gap={16}>
              {/* USERNAME */}
              <Box>
                <Label name="email">Username</Label>
                <TextField
                  name="email"
                  ref={emailRef}
                  validation={{ required: true }}
                  className="rw-input"
                  onChange={() => authError && setAuthError(null)}
                />
                <FieldError name="email" />
              </Box>

              {/* PASSWORD */}
              <Box>
                <Label name="password">Password</Label>

                <Box style={{ position: 'relative' }}>
                  <PasswordField
                    name="password"
                    ref={passwordRef}
                    validation={{ required: true }}
                    className="rw-input"
                    style={{
                      width: '100%',
                      padding: '10px 44px 10px 12px',
                      borderRadius: 10,
                    }}
                    onChange={() => authError && setAuthError(null)}
                  />

                  <ActionIcon
                    variant="subtle"
                    onClick={() => {
                      if (!passwordRef.current) return
                      passwordRef.current.type =
                        passwordRef.current.type === 'password'
                          ? 'text'
                          : 'password'
                      setShowPassword((v) => !v)
                    }}
                    style={{
                      position: 'absolute',
                      right: 8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                    }}
                  >
                    {showPassword ? (
                      <IconEyeOff size={18} />
                    ) : (
                      <IconEye size={18} />
                    )}
                  </ActionIcon>
                </Box>

                <FieldError name="password" />
              </Box>

              {/* SUBMIT */}
              <Submit
                style={{
                  marginTop: 12,
                  height: 46,
                  borderRadius: 999,
                  fontWeight: 700,
                  background: theme.colors.purplelux[4],
                  color: 'white',
                }}
              >
                Sign in
              </Submit>

              {/* 🔴 AUTH ERROR (INSTAGRAM STYLE) */}
              {authError && (
                <Text size="sm" ta="center" c="red" style={{ marginTop: 4 }}>
                  {authError}
                </Text>
              )}
            </Stack>
          </Form>

          <Box mt={12} ta="center">
            <Anchor component={Link} to={routes.forgotPassword()} size="xs">
              Forgot password?
            </Anchor>
          </Box>

          <Text ta="center" size="sm" c={textSubtle} mt={16}>
            Don’t have an account?{' '}
            <Link to={routes.signup()} style={{ fontWeight: 600 }}>
              Sign up
            </Link>
          </Text>
        </AuthCard>
      </main>
    </>
  )
}
