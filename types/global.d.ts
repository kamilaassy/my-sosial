import '@redwoodjs/auth'

declare global {
  namespace RedwoodJS {
    interface CurrentUser {
      id: number
      email: string
      name?: string
      avatarUrl?: string
      role?: string
    }
  }
}
