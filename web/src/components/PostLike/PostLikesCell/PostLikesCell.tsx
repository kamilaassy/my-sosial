import type { FindPostLikes, FindPostLikesVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import PostLikes from 'src/components/PostLike/PostLikes'

export const QUERY: TypedDocumentNode<FindPostLikes, FindPostLikesVariables> =
  gql`
    query FindPostLikes {
      postLikes {
        id
        userId
        postId
        createdAt
        updatedAt
      }
    }
  `

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No postLikes yet.{' '}
      <Link to={routes.newPostLike()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindPostLikes>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  postLikes,
}: CellSuccessProps<FindPostLikes, FindPostLikesVariables>) => {
  return <PostLikes postLikes={postLikes} />
}
