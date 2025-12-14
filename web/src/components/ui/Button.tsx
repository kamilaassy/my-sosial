import { Button as MButton } from '@mantine/core'

export const Button = ({ children, ...props }) => {
  return (
    <MButton
      radius="xl"
      color="purplelux"
      fw={600}
      styles={{
        root: {
          backdropFilter: 'blur(8px)',
          boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
        },
      }}
      {...props}
    >
      {children}
    </MButton>
  )
}
