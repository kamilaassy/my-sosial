import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'

import { ReactNode } from 'react'

import {
  MantineProvider,
  createTheme,
  localStorageColorSchemeManager,
} from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'

import { FatalErrorBoundary, RedwoodProvider } from '@redwoodjs/web'
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'

import { PostComposerProvider } from 'src/components/PostComposer/PostComposerContext'
import FatalErrorPage from 'src/pages/FatalErrorPage'

import { AuthProvider, useAuth } from './auth'

import './index.css'
import './scaffold.css'

interface AppProps {
  children?: ReactNode
}

const colorSchemeManager = localStorageColorSchemeManager({
  key: 'theme',
})

/* ======================================================
   PURPLELUX THEME — CLEAN & CONSISTENT
====================================================== */
const theme = createTheme({
  fontFamily:
    'SF Pro, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',

  colors: {
    purplelux: [
      '#faeaed', // 0
      '#E9B9C3', // 1
      '#D69BA5', // 2
      '#C18390', // 3
      '#A05C84', // 4 (primary)
      '#8B4A71', // 5
      '#6A3742', // 6
      '#603649', // 7
      '#361B27', // 8
      '#25161d', // 9
    ],
  },

  primaryColor: 'purplelux',
  primaryShade: 4,
  defaultRadius: 'md',
})

/* ======================================================
   APP ROOT
====================================================== */
const App = ({ children }: AppProps) => {
  return (
    <>
      {/* GLOBAL GLASS BACKGROUND */}
      <div className="efvn-bg" />

      <MantineProvider theme={theme} colorSchemeManager={colorSchemeManager}>
        <ModalsProvider>
          <FatalErrorBoundary page={FatalErrorPage}>
            <RedwoodProvider titleTemplate="%PageTitle | EFVN">
              <AuthProvider>
                <RedwoodApolloProvider useAuth={useAuth}>
                  <PostComposerProvider>{children}</PostComposerProvider>
                </RedwoodApolloProvider>
              </AuthProvider>
            </RedwoodProvider>
          </FatalErrorBoundary>
        </ModalsProvider>
      </MantineProvider>
    </>
  )
}

export default App
