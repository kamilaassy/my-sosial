import type { APIGatewayProxyEvent, Context } from 'aws-lambda'

import { DbAuthHandler } from '@redwoodjs/auth-dbauth-api'
import type { DbAuthHandlerOptions, UserType } from '@redwoodjs/auth-dbauth-api'

import { cookieName } from 'src/lib/auth'
import { db } from 'src/lib/db'

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
) => {
  /* ============================================================
     FORGOT PASSWORD
  ============================================================ */
  const forgotPasswordOptions: DbAuthHandlerOptions['forgotPassword'] = {
    handler: (user) => user,
    expires: 60 * 60 * 24,
    errors: {
      usernameNotFound: 'Username not found',
      usernameRequired: 'Username is required',
    },
  }

  /* ============================================================
     LOGIN OPTIONS — username = email
  ============================================================ */
  const loginOptions: DbAuthHandlerOptions['login'] = {
    handler: (user) => user,

    errors: {
      usernameOrPasswordMissing: 'Both username and password are required',
      usernameNotFound: 'Username not found',
      incorrectPassword: 'Incorrect password',
    },

    expires: 60 * 60 * 24 * 365 * 10, // 10 years
  }

  /* ============================================================
     RESET PASSWORD
  ============================================================ */
  const resetPasswordOptions: DbAuthHandlerOptions['resetPassword'] = {
    handler: () => true,

    allowReusedPassword: true,

    errors: {
      resetTokenExpired: 'resetToken is expired',
      resetTokenInvalid: 'resetToken is invalid',
      resetTokenRequired: 'resetToken is required',
      reusedPassword: 'Must choose a new password',
    },
  }

  /* ============================================================
     SIGNUP OPTIONS — username = email
  ============================================================ */

  interface UserAttributes {
    name: string
  }

  const signupOptions: DbAuthHandlerOptions<
    UserType,
    UserAttributes
  >['signup'] = {
    handler: ({ username, hashedPassword, salt, userAttributes }) => {
      console.log('SIGNUP userAttributes:', userAttributes)

      return db.user.create({
        data: {
          email: username,
          name: userAttributes?.name ?? null,
          hashedPassword,
          salt,
          role: 'user',
        },
      })
    },

    passwordValidation: () => true,

    errors: {
      fieldMissing: 'Field is required',
      usernameTaken: 'Username already in use',
    },
  }

  /* ============================================================
     AUTH HANDLER ROOT
  ============================================================ */
  const authHandler = new DbAuthHandler(event, context, {
    db: db,

    authModelAccessor: 'user',

    authFields: {
      id: 'id',
      username: 'email', // <<< THIS MAKES USERNAME = email
      hashedPassword: 'hashedPassword',
      salt: 'salt',
      resetToken: 'resetToken',
      resetTokenExpiresAt: 'resetTokenExpiresAt',
    },

    allowedUserFields: ['id', 'email', 'name', 'role', 'isBanned'],

    cookie: {
      attributes: {
        HttpOnly: true,
        Path: '/',
        SameSite: 'Lax',
        Secure: process.env.NODE_ENV !== 'development',
      },
      name: cookieName,
    },

    forgotPassword: forgotPasswordOptions,
    login: loginOptions,
    resetPassword: resetPasswordOptions,
    signup: signupOptions,
  })

  console.log('SESSION CALL:', event.path, event.httpMethod)

  return await authHandler.invoke()
}
