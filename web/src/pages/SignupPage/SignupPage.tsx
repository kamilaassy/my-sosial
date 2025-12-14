import { useEffect, useRef, useState } from 'react'

import {
  Stack,
  Title,
  Text,
  Box,
  ActionIcon,
  useMantineTheme,
} from '@mantine/core'
import { IconEye, IconEyeOff } from '@tabler/icons-react'

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
import { useMutation } from '@redwoodjs/web'
import { toast, Toaster } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'
import { AuthCard } from 'src/components/ui/AuthCard'
import { UPDATE_PROFILE } from 'src/graphql/editProfile'

export default function SignupPage() {
  const { isAuthenticated, signUp } = useAuth()
  const theme = useMantineTheme()
  const [updateProfile] = useMutation(UPDATE_PROFILE)

  const [showPassword, setShowPassword] = useState(false)
  const passwordRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)

  const isDark =
    document.documentElement.getAttribute('data-mantine-color-scheme') ===
    'dark'

  useEffect(() => {
    if (isAuthenticated) navigate(routes.home())
  }, [isAuthenticated])

  useEffect(() => emailRef.current?.focus(), [])

  const onSubmit = async (data: {
    email?: string
    name?: string
    password?: string
  }) => {
    const res = await signUp({
      username: data.email,
      password: data.password,
    })

    if (res.error) {
      toast.error(res.error)
      return
    }

    await updateProfile({
      variables: { input: { name: data.name } },
    })

    toast.success('Welcome!')
    navigate(routes.home())
  }

  const textMain = isDark
    ? theme.colors.purplelux[0]
    : theme.colors.purplelux[9]

  const textSubtle = isDark
    ? theme.colors.purplelux[2]
    : theme.colors.purplelux[6]

  return (
    <>
      <Metadata title="Signup" />
      <Toaster />

      <main className="auth-center">
        <AuthCard>
          {/* HEADER — SAMA STRUKTUR */}
          <Stack align="center" gap={4}>
            <Title fw={700} c={textMain}>
              Create account
            </Title>
            <Text size="sm" c={textSubtle}>
              Please fill the form below
            </Text>
          </Stack>

          {/* FORM */}
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
                />
                <FieldError name="email" />
              </Box>

              {/* NAME */}
              <Box>
                <Label name="name">Name</Label>
                <TextField
                  name="name"
                  validation={{ required: true }}
                  className="rw-input"
                />
                <FieldError name="name" />
              </Box>

              {/* PASSWORD */}
              <Box>
                <Label name="password">Password</Label>

                <Box style={{ position: 'relative' }}>
                  <PasswordField
                    name="password"
                    ref={passwordRef}
                    validation={{
                      required: true,
                      minLength: 8,
                    }}
                    className="rw-input"
                    style={{
                      width: '100%',
                      padding: '10px 44px 10px 12px',
                      borderRadius: 10,
                    }}
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
                Sign up
              </Submit>
            </Stack>
          </Form>

          {/* FOOTER */}
          <Text ta="center" size="sm" c={textSubtle}>
            Already have an account?{' '}
            <Link to={routes.login()} style={{ fontWeight: 600 }}>
              Sign in
            </Link>
          </Text>
        </AuthCard>
      </main>
    </>
  )
}
