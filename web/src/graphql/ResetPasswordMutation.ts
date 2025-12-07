import gql from 'graphql-tag'

export const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPasswordMutation($token: String!, $newPassword: String!) {
    resetPassword(token: $token, newPassword: $newPassword)
  }
`
