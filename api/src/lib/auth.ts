import type { Decoded } from '@redwoodjs/api'
import { AuthenticationError, ForbiddenError } from '@redwoodjs/graphql-server'

import { db } from './db'

export const cookieName = 'session_%port%'

// Redwood receives { username, password } instead of { email, password }
export const getCurrentUser = async (session: Decoded) => {
  if (!session || !session.id) {
    throw new Error('Invalid session')
  }

  const user = await db.user.findUnique({
    where: { id: Number(session.id) },
    select: {
      id: true,
      email: true, // <-- ini isinya username kamu
      name: true,
      role: true,
      isBanned: true,
    },
  })

  if (!user) throw new Error('User not found')

  return user
}

export const isAuthenticated = (): boolean => {
  return !!context.currentUser
}

export const hasRole = (roles?: string | string[]): boolean => {
  if (!isAuthenticated()) return false

  const role = context.currentUser?.role

  if (!roles) return true
  if (typeof roles === 'string') return role === roles
  if (Array.isArray(roles)) return roles.includes(role)

  return false
}

export const requireAuth = ({ roles }: { roles?: string | string[] } = {}) => {
  if (!isAuthenticated()) {
    throw new AuthenticationError("You don't have permission to do that.")
  }

  if (context.currentUser?.isBanned) {
    throw new ForbiddenError('Your account is banned.')
  }

  if (roles && !hasRole(roles)) {
    throw new ForbiddenError("You don't have access to do that.")
  }
}
