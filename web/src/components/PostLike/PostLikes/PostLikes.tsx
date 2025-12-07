import type {
  DeletePostLikeMutation,
  DeletePostLikeMutationVariables,
  FindPostLikes,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/PostLike/PostLikesCell'
import { timeTag, truncate } from 'src/lib/formatters'

const DELETE_POST_LIKE_MUTATION: TypedDocumentNode<
  DeletePostLikeMutation,
  DeletePostLikeMutationVariables
> = gql`
  mutation DeletePostLikeMutation($id: Int!) {
    deletePostLike(id: $id) {
      id
    }
  }
`

const PostLikesList = ({ postLikes }: FindPostLikes) => {
  const [deletePostLike] = useMutation(DELETE_POST_LIKE_MUTATION, {
    onCompleted: () => {
      toast.success('PostLike deleted')
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

  const onDeleteClick = (id: DeletePostLikeMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete postLike ' + id + '?')) {
      deletePostLike({ variables: { id } })
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
            <th>Updated at</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {postLikes.map((postLike) => (
            <tr key={postLike.id}>
              <td>{truncate(postLike.id)}</td>
              <td>{truncate(postLike.userId)}</td>
              <td>{truncate(postLike.postId)}</td>
              <td>{timeTag(postLike.createdAt)}</td>
              <td>{timeTag(postLike.updatedAt)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.postLike({ id: postLike.id })}
                    title={'Show postLike ' + postLike.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editPostLike({ id: postLike.id })}
                    title={'Edit postLike ' + postLike.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete postLike ' + postLike.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(postLike.id)}
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

export default PostLikesList
