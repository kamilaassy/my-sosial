import { ReactNode } from 'react'

import {
  MantineProvider,
  createTheme,
  localStorageColorSchemeManager,
} from '@mantine/core'

import { FatalErrorBoundary, RedwoodProvider } from '@redwoodjs/web'
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'

import FatalErrorPage from 'src/pages/FatalErrorPage'

import { AuthProvider, useAuth } from './auth'

import './index.css'
import './scaffold.css'

interface AppProps {
  children?: ReactNode
}

const colorSchemeManager = localStorageColorSchemeManager({ key: 'theme' })
const theme = createTheme({
  fontFamily: 'Inter, sans-serif',
})

const App = ({ children }: AppProps) => {
  return (
    <MantineProvider
      defaultColorScheme="light"
      colorSchemeManager={colorSchemeManager}
      theme={theme}
    >
      <FatalErrorBoundary page={FatalErrorPage}>
        <RedwoodProvider titleTemplate="%PageTitle | CloudSocial">
          <AuthProvider>
            <RedwoodApolloProvider useAuth={useAuth}>
              {children}
            </RedwoodApolloProvider>
          </AuthProvider>
        </RedwoodProvider>
      </FatalErrorBoundary>
    </MantineProvider>
  )
}

export default App
