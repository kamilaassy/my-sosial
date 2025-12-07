import type {
  EditPostLikeById,
  UpdatePostLikeInput,
  UpdatePostLikeMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import PostLikeForm from 'src/components/PostLike/PostLikeForm'

export const QUERY: TypedDocumentNode<EditPostLikeById> = gql`
  query EditPostLikeById($id: Int!) {
    postLike: postLike(id: $id) {
      id
      userId
      postId
      createdAt
      updatedAt
    }
  }
`

const UPDATE_POST_LIKE_MUTATION: TypedDocumentNode<
  EditPostLikeById,
  UpdatePostLikeMutationVariables
> = gql`
  mutation UpdatePostLikeMutation($id: Int!, $input: UpdatePostLikeInput!) {
    updatePostLike(id: $id, input: $input) {
      id
      userId
      postId
      createdAt
      updatedAt
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ postLike }: CellSuccessProps<EditPostLikeById>) => {
  const [updatePostLike, { loading, error }] = useMutation(
    UPDATE_POST_LIKE_MUTATION,
    {
      onCompleted: () => {
        toast.success('PostLike updated')
        navigate(routes.postLikes())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdatePostLikeInput,
    id: EditPostLikeById['postLike']['id']
  ) => {
    updatePostLike({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit PostLike {postLike?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <PostLikeForm
          postLike={postLike}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
