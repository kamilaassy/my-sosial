import { login } from 'src/services/auth/login'

export const Mutation = {
  login: (_parent, args) => login(args),
}
