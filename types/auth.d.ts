import '@redwoodjs/auth'

declare module '@redwoodjs/auth' {
  interface AuthContextPayload {
    id: number
    email: string
    name?: string
    avatarUrl?: string
    role?: string
  }
}
