import { Paper } from '@mantine/core'

export const Card = ({ children, ...props }) => {
  return (
    <Paper radius="lg" {...props}>
      {children}
    </Paper>
  )
}
