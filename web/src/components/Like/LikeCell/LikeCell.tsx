import type { FindLikeById, FindLikeByIdVariables } from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Like from 'src/components/Like/Like'

export const QUERY: TypedDocumentNode<FindLikeById, FindLikeByIdVariables> =
  gql`
    query FindLikeById($id: Int!) {
      like: like(id: $id) {
        id
        userId
        postId
        createdAt
      }
    }
  `

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Like not found</div>

export const Failure = ({ error }: CellFailureProps<FindLikeByIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  like,
}: CellSuccessProps<FindLikeById, FindLikeByIdVariables>) => {
  return <Like like={like} />
}
