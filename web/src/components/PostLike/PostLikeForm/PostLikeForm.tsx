import type { EditPostLikeById, UpdatePostLikeInput } from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import {
  Form,
  FormError,
  FieldError,
  Label,
  NumberField,
  Submit,
} from '@redwoodjs/forms'

type FormPostLike = NonNullable<EditPostLikeById['postLike']>

interface PostLikeFormProps {
  postLike?: EditPostLikeById['postLike']
  onSave: (data: UpdatePostLikeInput, id?: FormPostLike['id']) => void
  error: RWGqlError
  loading: boolean
}

const PostLikeForm = (props: PostLikeFormProps) => {
  const onSubmit = (data: FormPostLike) => {
    props.onSave(data, props?.postLike?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormPostLike> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="userId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          User id
        </Label>

        <NumberField
          name="userId"
          defaultValue={props.postLike?.userId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="userId" className="rw-field-error" />

        <Label
          name="postId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Post id
        </Label>

        <NumberField
          name="postId"
          defaultValue={props.postLike?.postId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="postId" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default PostLikeForm
