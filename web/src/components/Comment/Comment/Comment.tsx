import type {
  DeleteCommentMutation,
  DeleteCommentMutationVariables,
  FindCommentById,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { timeTag } from 'src/lib/formatters'

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

interface Props {
  comment: NonNullable<FindCommentById['comment']>
}

const Comment = ({ comment }: Props) => {
  const [deleteComment] = useMutation(DELETE_COMMENT_MUTATION, {
    onCompleted: () => {
      toast.success('Comment deleted')
      navigate(routes.comments())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteCommentMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete comment ' + id + '?')) {
      deleteComment({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Comment {comment.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{comment.id}</td>
            </tr>
            <tr>
              <th>Content</th>
              <td>{comment.content}</td>
            </tr>
            <tr>
              <th>Post id</th>
              <td>{comment.postId}</td>
            </tr>
            <tr>
              <th>Author id</th>
              <td>{comment.authorId}</td>
            </tr>
            <tr>
              <th>Created at</th>
              <td>{timeTag(comment.createdAt)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editComment({ id: comment.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(comment.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Comment
