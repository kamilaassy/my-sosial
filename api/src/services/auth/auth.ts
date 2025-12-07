import crypto from 'crypto'

import { hashPassword } from '@redwoodjs/auth-dbauth-api'

import { db } from 'src/lib/db'

interface ForgotPasswordArgs {
  email: string
}

interface ResetPasswordArgs {
  token: string
  newPassword: string
}

interface ValidateResetTokenArgs {
  token: string
}

const RESET_TOKEN_BYTES = 32
const RESET_TOKEN_EXPIRY_MS = 1000 * 60 * 60 // 1 jam

export const forgotPassword = async ({
  email,
}: ForgotPasswordArgs): Promise<boolean> => {
  const user = await db.user.findUnique({
    where: { email },
  })

  if (!user) {
    // Tetap return true supaya tidak bocorkan email valid/tidak
    return true
  }

  const token = crypto.randomBytes(RESET_TOKEN_BYTES).toString('hex')
  const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY_MS)

  await db.user.update({
    where: { id: user.id },
    data: {
      resetToken: token,
      resetTokenExpiresAt: expiresAt,
    },
  })

  console.log(`🔑 RESET TOKEN for ${email}: ${token}`)

  return true
}

export const validateResetToken = async ({
  token,
}: ValidateResetTokenArgs): Promise<boolean> => {
  if (!token) return false

  const user = await db.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiresAt: { gt: new Date() },
    },
  })

  return !!user
}

export const resetPassword = async ({
  token,
  newPassword,
}: ResetPasswordArgs) => {
  const user = await db.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiresAt: { gt: new Date() },
    },
  })

  if (!user) {
    throw new Error('Token tidak valid atau sudah kadaluarsa')
  }

  if (newPassword.length < 8) {
    throw new Error('Password harus minimal 8 karakter')
  }

  // ❗ Redwood dbAuth hashing
  const [hashedPassword, salt] = hashPassword(newPassword)

  await db.user.update({
    where: { id: user.id },
    data: {
      hashedPassword,
      salt, // ❗ Jangan lupa ini!
      resetToken: null,
      resetTokenExpiresAt: null,
    },
  })

  return true
}
