import type {
  EditFollowById,
  UpdateFollowInput,
  UpdateFollowMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import FollowForm from 'src/components/Follow/FollowForm'

export const QUERY: TypedDocumentNode<EditFollowById> = gql`
  query EditFollowById($id: Int!) {
    follow: follow(id: $id) {
      id
      followerId
      followingId
      createdAt
    }
  }
`

const UPDATE_FOLLOW_MUTATION: TypedDocumentNode<
  EditFollowById,
  UpdateFollowMutationVariables
> = gql`
  mutation UpdateFollowMutation($id: Int!, $input: UpdateFollowInput!) {
    updateFollow(id: $id, input: $input) {
      id
      followerId
      followingId
      createdAt
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ follow }: CellSuccessProps<EditFollowById>) => {
  const [updateFollow, { loading, error }] = useMutation(
    UPDATE_FOLLOW_MUTATION,
    {
      onCompleted: () => {
        toast.success('Follow updated')
        navigate(routes.follows())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateFollowInput,
    id: EditFollowById['follow']['id']
  ) => {
    updateFollow({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit Follow {follow?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <FollowForm
          follow={follow}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
