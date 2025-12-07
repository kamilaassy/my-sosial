import { Textarea } from '@mantine/core'

import { Button } from './Button'
import { Card } from './Card'

export const PostForm = ({ onSubmit }) => {
  return (
    <Card p="lg" mb="lg">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit(e)
        }}
      >
        <Textarea
          placeholder="What's on your mind?"
          autosize
          minRows={2}
          mb="md"
          radius="md"
        />

        <Button type="submit">Post</Button>
      </form>
    </Card>
  )
}
