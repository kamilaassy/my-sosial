import { useComputedColorScheme } from '@mantine/core'

export const PageContainer = ({ children }) => {
  const scheme = useComputedColorScheme()

  return (
    <div
      style={{
        maxWidth: 680,
        width: '100%',
        margin: '0 auto',
        paddingTop: scheme === 'dark' ? 16 : 24,
        paddingBottom: 40,
      }}
    >
      {children}
    </div>
  )
}
