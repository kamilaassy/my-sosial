import type { FindCommentById, FindCommentByIdVariables } from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Comment from 'src/components/Comment/Comment'

export const QUERY: TypedDocumentNode<
  FindCommentById,
  FindCommentByIdVariables
> = gql`
  query FindCommentById($id: Int!) {
    comment: comment(id: $id) {
      id
      content
      postId
      authorId
      createdAt
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Comment not found</div>

export const Failure = ({
  error,
}: CellFailureProps<FindCommentByIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  comment,
}: CellSuccessProps<FindCommentById, FindCommentByIdVariables>) => {
  return <Comment comment={comment} />
}
