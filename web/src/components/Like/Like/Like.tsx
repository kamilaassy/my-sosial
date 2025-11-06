import type {
  DeleteLikeMutation,
  DeleteLikeMutationVariables,
  FindLikeById,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { timeTag } from 'src/lib/formatters'

const DELETE_LIKE_MUTATION: TypedDocumentNode<
  DeleteLikeMutation,
  DeleteLikeMutationVariables
> = gql`
  mutation DeleteLikeMutation($id: Int!) {
    deleteLike(id: $id) {
      id
    }
  }
`

interface Props {
  like: NonNullable<FindLikeById['like']>
}

const Like = ({ like }: Props) => {
  const [deleteLike] = useMutation(DELETE_LIKE_MUTATION, {
    onCompleted: () => {
      toast.success('Like deleted')
      navigate(routes.likes())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteLikeMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete like ' + id + '?')) {
      deleteLike({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Like {like.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{like.id}</td>
            </tr>
            <tr>
              <th>User id</th>
              <td>{like.userId}</td>
            </tr>
            <tr>
              <th>Post id</th>
              <td>{like.postId}</td>
            </tr>
            <tr>
              <th>Created at</th>
              <td>{timeTag(like.createdAt)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editLike({ id: like.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(like.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Like
