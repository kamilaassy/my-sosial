import type { EditFollowById, UpdateFollowInput } from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import {
  Form,
  FormError,
  FieldError,
  Label,
  NumberField,
  Submit,
} from '@redwoodjs/forms'

type FormFollow = NonNullable<EditFollowById['follow']>

interface FollowFormProps {
  follow?: EditFollowById['follow']
  onSave: (data: UpdateFollowInput, id?: FormFollow['id']) => void
  error: RWGqlError
  loading: boolean
}

const FollowForm = (props: FollowFormProps) => {
  const onSubmit = (data: FormFollow) => {
    props.onSave(data, props?.follow?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormFollow> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="followerId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Follower id
        </Label>

        <NumberField
          name="followerId"
          defaultValue={props.follow?.followerId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="followerId" className="rw-field-error" />

        <Label
          name="followingId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Following id
        </Label>

        <NumberField
          name="followingId"
          defaultValue={props.follow?.followingId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="followingId" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default FollowForm
