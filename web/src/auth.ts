import { createDbAuthClient, createAuth } from '@redwoodjs/auth-dbAuth-web'

const dbAuthClient = createDbAuthClient()

export const { AuthProvider, useAuth } = createAuth(dbAuthClient)
