import { Container } from '@mantine/core'

export const PageContainer = ({ children }) => (
  <Container
    size="sm"
    px="md"
    mt="xl"
    style={{
      maxWidth: 740,
      width: '100%',
    }}
  >
    {children}
  </Container>
)
