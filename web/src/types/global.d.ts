export {}

declare global {
  interface Window {
    currentUser?: {
      id: number
      email: string
      name?: string | null
      role?: string
    }
  }
}
