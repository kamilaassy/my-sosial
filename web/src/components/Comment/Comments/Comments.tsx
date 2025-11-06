import type {
  DeleteCommentMutation,
  DeleteCommentMutationVariables,
  FindComments,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Comment/CommentsCell'
import { timeTag, truncate } from 'src/lib/formatters'

const DELETE_COMMENT_MUTATION: TypedDocumentNode<
  DeleteCommentMutation,
  DeleteCommentMutationVariables
> = gql`
  mutation DeleteCommentMutation($id: Int!) {
    deleteComment(id: $id) {
      id
    }
  }
`

const CommentsList = ({ comments }: FindComments) => {
  const [deleteComment] = useMutation(DELETE_COMMENT_MUTATION, {
    onCompleted: () => {
      toast.success('Comment deleted')
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

  const onDeleteClick = (id: DeleteCommentMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete comment ' + id + '?')) {
      deleteComment({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Content</th>
            <th>Post id</th>
            <th>Author id</th>
            <th>Created at</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {comments.map((comment) => (
            <tr key={comment.id}>
              <td>{truncate(comment.id)}</td>
              <td>{truncate(comment.content)}</td>
              <td>{truncate(comment.postId)}</td>
              <td>{truncate(comment.authorId)}</td>
              <td>{timeTag(comment.createdAt)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.comment({ id: comment.id })}
                    title={'Show comment ' + comment.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editComment({ id: comment.id })}
                    title={'Edit comment ' + comment.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete comment ' + comment.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(comment.id)}
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

export default CommentsList
