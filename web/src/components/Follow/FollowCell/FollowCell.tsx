import type { FindFollowById, FindFollowByIdVariables } from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Follow from 'src/components/Follow/Follow'

export const QUERY: TypedDocumentNode<FindFollowById, FindFollowByIdVariables> =
  gql`
    query FindFollowById($id: Int!) {
      follow: follow(id: $id) {
        id
        followerId
        followingId
        createdAt
      }
    }
  `

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Follow not found</div>

export const Failure = ({
  error,
}: CellFailureProps<FindFollowByIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  follow,
}: CellSuccessProps<FindFollowById, FindFollowByIdVariables>) => {
  return <Follow follow={follow} />
}
