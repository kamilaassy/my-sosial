import type { Decoded } from '@redwoodjs/api'
import { AuthenticationError, ForbiddenError } from '@redwoodjs/graphql-server'

import { db } from './db'

export const cookieName = 'session_%port%'

// Mendapatkan user yang sedang login
export const getCurrentUser = async (session: Decoded) => {
  if (!session || !session.id) {
    throw new Error('Invalid session')
  }

  // session.id dikonversi ke number kalau ID user di DB bertipe Int
  const userId = Number(session.id)

  return await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      role: true,
    },
  })
}

// Mengecek apakah user sudah login
export const isAuthenticated = (): boolean => {
  return !!context.currentUser
}

// Mengecek role user
type AllowedRoles = string | string[] | undefined

export const hasRole = (roles: AllowedRoles): boolean => {
  if (!isAuthenticated()) {
    return false
  }

  const currentUserRole = context.currentUser?.role

  if (!roles) return true
  if (typeof roles === 'string') {
    return currentUserRole === roles
  }
  if (Array.isArray(roles)) {
    return roles.includes(currentUserRole)
  }

  return false
}

// Proteksi akses (digunakan di services)
export const requireAuth = ({ roles }: { roles?: AllowedRoles } = {}) => {
  if (!isAuthenticated()) {
    throw new AuthenticationError("You don't have permission to do that.")
  }

  if (roles && !hasRole(roles)) {
    throw new ForbiddenError("You don't have access to do that.")
  }
}
