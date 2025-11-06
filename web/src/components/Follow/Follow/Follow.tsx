import type {
  DeleteFollowMutation,
  DeleteFollowMutationVariables,
  FindFollowById,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { timeTag } from 'src/lib/formatters'

const DELETE_FOLLOW_MUTATION: TypedDocumentNode<
  DeleteFollowMutation,
  DeleteFollowMutationVariables
> = gql`
  mutation DeleteFollowMutation($id: Int!) {
    deleteFollow(id: $id) {
      id
    }
  }
`

interface Props {
  follow: NonNullable<FindFollowById['follow']>
}

const Follow = ({ follow }: Props) => {
  const [deleteFollow] = useMutation(DELETE_FOLLOW_MUTATION, {
    onCompleted: () => {
      toast.success('Follow deleted')
      navigate(routes.follows())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteFollowMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete follow ' + id + '?')) {
      deleteFollow({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Follow {follow.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{follow.id}</td>
            </tr>
            <tr>
              <th>Follower id</th>
              <td>{follow.followerId}</td>
            </tr>
            <tr>
              <th>Following id</th>
              <td>{follow.followingId}</td>
            </tr>
            <tr>
              <th>Created at</th>
              <td>{timeTag(follow.createdAt)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editFollow({ id: follow.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(follow.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Follow
