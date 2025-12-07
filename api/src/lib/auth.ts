import type { Decoded } from '@redwoodjs/api'
import { AuthenticationError, ForbiddenError } from '@redwoodjs/graphql-server'

import { db } from './db'

export const cookieName = 'session_%port%'

export const getCurrentUser = async (session: Decoded) => {
  if (!session || !session.id) {
    throw new Error('Invalid session')
  }

  const userId = Number(session.id)

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      role: true,
      isBanned: true,
    },
  })

  if (!user) {
    throw new Error('User not found')
  }

  console.log('FOUND USER:', user)

  return user
}

export const isAuthenticated = (): boolean => {
  return !!context.currentUser
}

type AllowedRoles = string | string[] | undefined

export const hasRole = (roles: AllowedRoles): boolean => {
  if (!isAuthenticated()) return false

  const role = context.currentUser?.role

  if (!roles) return true
  if (typeof roles === 'string') return role === roles
  if (Array.isArray(roles)) return roles.includes(role)

  return false
}

export const requireAuth = ({ roles }: { roles?: AllowedRoles } = {}) => {
  if (!isAuthenticated()) {
    throw new AuthenticationError("You don't have permission to do that.")
  }

  // BAN CHECK di sini → semua aksi otomatis terblokir
  if (context.currentUser?.isBanned) {
    throw new ForbiddenError('Your account is banned.')
  }

  if (roles && !hasRole(roles)) {
    throw new ForbiddenError("You don't have access to do that.")
  }
}
