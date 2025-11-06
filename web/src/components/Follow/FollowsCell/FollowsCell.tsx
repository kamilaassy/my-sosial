import type { FindFollows, FindFollowsVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Follows from 'src/components/Follow/Follows'

export const QUERY: TypedDocumentNode<FindFollows, FindFollowsVariables> = gql`
  query FindFollows {
    follows {
      id
      followerId
      followingId
      createdAt
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No follows yet.{' '}
      <Link to={routes.newFollow()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindFollows>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  follows,
}: CellSuccessProps<FindFollows, FindFollowsVariables>) => {
  return <Follows follows={follows} />
}
