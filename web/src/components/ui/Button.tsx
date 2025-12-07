import { Button as MButton } from '@mantine/core'

export const Button = ({ children, ...props }) => {
  return (
    <MButton
      radius="md"
      color="purplelux"
      style={{ fontWeight: 600 }}
      {...props}
    >
      {children}
    </MButton>
  )
}
