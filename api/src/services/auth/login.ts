import bcrypt from 'bcryptjs'

import { AuthenticationError } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'

interface LoginArgs {
  email: string
  password: string
}

export const login = async ({ email, password }: LoginArgs) => {
  const user = await db.user.findUnique({
    where: { email },
  })

  if (!user) {
    throw new AuthenticationError('Incorrect email or password')
  }

  // periksa password dengan bcrypt.compare
  const valid = await bcrypt.compare(password, user.hashedPassword)

  if (!valid) {
    throw new AuthenticationError('Incorrect email or password')
  }

  // return session data
  return {
    id: user.id,
    email: user.email,
    role: user.role,
  }
}
