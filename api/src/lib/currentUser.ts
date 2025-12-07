export interface CurrentUser {
  id: number
  email: string
  name?: string
  avatarUrl?: string
  role?: string
  isBanned?: boolean
}

// Type guard: memastikan context.currentUser adalah CurrentUser
export function isCurrentUser(u: unknown): u is CurrentUser {
  return typeof u === 'object' && u !== null && 'id' in u && 'email' in u
}

// Helper yang aman & tanpa any
export function requireCurrentUser(context: {
  currentUser?: unknown
}): CurrentUser {
  if (!isCurrentUser(context.currentUser)) {
    throw new Error('User not authenticated.')
  }
  return context.currentUser
}
