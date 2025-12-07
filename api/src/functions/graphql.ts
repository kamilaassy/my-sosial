import { createAuthDecoder } from '@redwoodjs/auth-dbauth-api'
import { createGraphQLHandler } from '@redwoodjs/graphql-server'

import directives from 'src/directives/**/*.{js,ts}'
import sdls from 'src/graphql/**/*.sdl.{js,ts}'
import services from 'src/services/**/*.{js,ts}'

import { cookieName, getCurrentUser } from 'src/lib/auth'
import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'
import {
  forgotPassword,
  resetPassword,
  validateResetToken,
} from 'src/services/auth/auth'

const authDecoder = createAuthDecoder(cookieName)

export const handler = createGraphQLHandler({
  authDecoder,
  getCurrentUser,
  loggerConfig: { logger, options: {} },
  directives,
  sdls,
  services,
  onException: () => {
    db.$disconnect()
  },
})

export const Mutation = {
  forgotPassword: (_: unknown, args: { email: string }) => forgotPassword(args),
  resetPassword: (_: unknown, args: { token: string; newPassword: string }) =>
    resetPassword(args),
}

export const Query = {
  validateResetToken: (_: unknown, args: { token: string }) =>
    validateResetToken(args),
}
