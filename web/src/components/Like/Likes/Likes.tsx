import type {
  DeleteLikeMutation,
  DeleteLikeMutationVariables,
  FindLikes,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Like/LikesCell'
import { timeTag, truncate } from 'src/lib/formatters'

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

const LikesList = ({ likes }: FindLikes) => {
  const [deleteLike] = useMutation(DELETE_LIKE_MUTATION, {
    onCompleted: () => {
      toast.success('Like deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const onDeleteClick = (id: DeleteLikeMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete like ' + id + '?')) {
      deleteLike({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>User id</th>
            <th>Post id</th>
            <th>Created at</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {likes.map((like) => (
            <tr key={like.id}>
              <td>{truncate(like.id)}</td>
              <td>{truncate(like.userId)}</td>
              <td>{truncate(like.postId)}</td>
              <td>{timeTag(like.createdAt)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.like({ id: like.id })}
                    title={'Show like ' + like.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editLike({ id: like.id })}
                    title={'Edit like ' + like.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete like ' + like.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(like.id)}
                  >
                    Delete
                  </button>
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default LikesList
