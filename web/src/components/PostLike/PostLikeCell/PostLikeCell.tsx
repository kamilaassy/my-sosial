import type { FindPostLikeById, FindPostLikeByIdVariables } from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import PostLike from 'src/components/PostLike/PostLike'

export const QUERY: TypedDocumentNode<
  FindPostLikeById,
  FindPostLikeByIdVariables
> = gql`
  query FindPostLikeById($id: Int!) {
    postLike: postLike(id: $id) {
      id
      userId
      postId
      createdAt
      updatedAt
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>PostLike not found</div>

export const Failure = ({
  error,
}: CellFailureProps<FindPostLikeByIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  postLike,
}: CellSuccessProps<FindPostLikeById, FindPostLikeByIdVariables>) => {
  return <PostLike postLike={postLike} />
}
