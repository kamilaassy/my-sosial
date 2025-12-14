import { Container } from '@mantine/core'

export const AuthLayout = ({ children }) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
      }}
    >
      <Container size={420} px={0}>
        {children}
      </Container>
    </div>
  )
}
