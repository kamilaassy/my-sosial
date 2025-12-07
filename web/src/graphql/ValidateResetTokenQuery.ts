import gql from 'graphql-tag'

export const VALIDATE_RESET_TOKEN_QUERY = gql`
  query ValidateResetTokenQuery($token: String!) {
    validateResetToken(token: $token)
  }
`
