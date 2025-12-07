import { Center } from '@mantine/core'

export const Page = ({ children }) => (
  <Center
    style={{
      minHeight: '100vh',
      padding: 16,
    }}
  >
    {children}
  </Center>
)
