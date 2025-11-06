import type { FindComments, FindCommentsVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Comments from 'src/components/Comment/Comments'

export const QUERY: TypedDocumentNode<FindComments, FindCommentsVariables> =
  gql`
    query FindComments {
      comments {
        id
        content
        postId
        authorId
        createdAt
      }
    }
  `

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No comments yet.{' '}
      <Link to={routes.newComment()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindComments>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  comments,
}: CellSuccessProps<FindComments, FindCommentsVariables>) => {
  return <Comments comments={comments} />
}
