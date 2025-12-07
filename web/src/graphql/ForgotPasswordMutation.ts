import gql from 'graphql-tag'

export const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPasswordMutation($email: String!) {
    forgotPassword(email: $email)
  }
`
