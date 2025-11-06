import type { EditCommentById, UpdateCommentInput } from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  NumberField,
  Submit,
} from '@redwoodjs/forms'

type FormComment = NonNullable<EditCommentById['comment']>

interface CommentFormProps {
  comment?: EditCommentById['comment']
  onSave: (data: UpdateCommentInput, id?: FormComment['id']) => void
  error: RWGqlError
  loading: boolean
}

const CommentForm = (props: CommentFormProps) => {
  const onSubmit = (data: FormComment) => {
    props.onSave(data, props?.comment?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormComment> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="content"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Content
        </Label>

        <TextField
          name="content"
          defaultValue={props.comment?.content}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="content" className="rw-field-error" />

        <Label
          name="postId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Post id
        </Label>

        <NumberField
          name="postId"
          defaultValue={props.comment?.postId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="postId" className="rw-field-error" />

        <Label
          name="authorId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Author id
        </Label>

        <NumberField
          name="authorId"
          defaultValue={props.comment?.authorId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="authorId" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default CommentForm
