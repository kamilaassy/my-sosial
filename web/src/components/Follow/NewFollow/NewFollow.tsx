import type {
  CreateFollowMutation,
  CreateFollowInput,
  CreateFollowMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import FollowForm from 'src/components/Follow/FollowForm'

const CREATE_FOLLOW_MUTATION: TypedDocumentNode<
  CreateFollowMutation,
  CreateFollowMutationVariables
> = gql`
  mutation CreateFollowMutation($input: CreateFollowInput!) {
    createFollow(input: $input) {
      id
    }
  }
`

const NewFollow = () => {
  const [createFollow, { loading, error }] = useMutation(
    CREATE_FOLLOW_MUTATION,
    {
      onCompleted: () => {
        toast.success('Follow created')
        navigate(routes.follows())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateFollowInput) => {
    createFollow({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Follow</h2>
      </header>
      <div className="rw-segment-main">
        <FollowForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewFollow
