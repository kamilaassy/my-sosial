import { createDbAuthClient, createAuth } from '@redwoodjs/auth-dbAuth-web'

const dbAuthClient = createDbAuthClient({
  fetchConfig: {
    credentials: 'include',
  },
})

export const { AuthProvider, useAuth } = createAuth(dbAuthClient)
