import type {
  CreatePostLikeMutation,
  CreatePostLikeInput,
  CreatePostLikeMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import PostLikeForm from 'src/components/PostLike/PostLikeForm'

const CREATE_POST_LIKE_MUTATION: TypedDocumentNode<
  CreatePostLikeMutation,
  CreatePostLikeMutationVariables
> = gql`
  mutation CreatePostLikeMutation($input: CreatePostLikeInput!) {
    createPostLike(input: $input) {
      id
    }
  }
`

const NewPostLike = () => {
  const [createPostLike, { loading, error }] = useMutation(
    CREATE_POST_LIKE_MUTATION,
    {
      onCompleted: () => {
        toast.success('PostLike created')
        navigate(routes.postLikes())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreatePostLikeInput) => {
    createPostLike({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New PostLike</h2>
      </header>
      <div className="rw-segment-main">
        <PostLikeForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewPostLike
