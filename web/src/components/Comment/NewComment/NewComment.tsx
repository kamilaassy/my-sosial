import type {
  CreateCommentMutation,
  CreateCommentInput,
  CreateCommentMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import CommentForm from 'src/components/Comment/CommentForm'

const CREATE_COMMENT_MUTATION: TypedDocumentNode<
  CreateCommentMutation,
  CreateCommentMutationVariables
> = gql`
  mutation CreateCommentMutation($input: CreateCommentInput!) {
    createComment(input: $input) {
      id
    }
  }
`

const NewComment = () => {
  const [createComment, { loading, error }] = useMutation(
    CREATE_COMMENT_MUTATION,
    {
      onCompleted: () => {
        toast.success('Comment created')
        navigate(routes.comments())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateCommentInput) => {
    createComment({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Comment</h2>
      </header>
      <div className="rw-segment-main">
        <CommentForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewComment
