import type { FindLikes, FindLikesVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Likes from 'src/components/Like/Likes'

export const QUERY: TypedDocumentNode<FindLikes, FindLikesVariables> = gql`
  query FindLikes {
    likes {
      id
      userId
      postId
      createdAt
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No likes yet.{' '}
      <Link to={routes.newLike()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindLikes>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  likes,
}: CellSuccessProps<FindLikes, FindLikesVariables>) => {
  return <Likes likes={likes} />
}
