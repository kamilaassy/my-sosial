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

import FatalErrorPage from 'src/pages/FatalErrorPage'

import { AuthProvider, useAuth } from './auth'

import './index.css'
import './scaffold.css'

interface AppProps {
  children?: ReactNode
}

const colorSchemeManager = localStorageColorSchemeManager({ key: 'theme' })

// ======================================================
//                PURPLELUX GLOBAL THEME
// ======================================================
const theme = createTheme({
  fontFamily:
    'SF Pro, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',

  colors: {
    purplelux: [
      '#faeaed', // 0 — Lightest Pink
      '#E9B9C3', // 1 — Soft Rose
      '#D69BA5', // 2 — Light Pink Surface
      '#C18390', // 3 — Mauve Pink
      '#A05C84', // 4 — Primary Pink
      '#8B4A71', // 5 — Deep Dusty Pink
      '#6A3742', // 6 — Burgundy (accent/border)
      '#603649', // 7 — Mulberry
      '#361B27', // 8 — Dark Merlot (dark surfaces)
      '#25161d', // 9 — Deep Plum Black
    ],
  },

  primaryColor: 'purplelux',
  primaryShade: 4,
  defaultRadius: 'md',

  components: {
    Popover: {
      styles: (theme) => ({
        dropdown: {
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.purplelux[9]
              : theme.colors.purplelux[1],
          border: `1px solid ${
            theme.colorScheme === 'dark'
              ? theme.colors.purplelux[7]
              : theme.colors.purplelux[3]
          }`,
        },
      }),
    },

    ScrollArea: {
      styles: (theme) => ({
        viewport: {
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.purplelux[9]
              : theme.colors.purplelux[1],
          color:
            theme.colorScheme === 'dark'
              ? theme.colors.purplelux[0]
              : theme.colors.purplelux[8],
        },
      }),
    },

    // ======================================================
    //                        BUTTON
    // ======================================================
    Button: {
      styles: (theme) => ({
        root: {
          fontWeight: 600,
          color: 'white',
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.purplelux[5]
              : theme.colors.purplelux[4],
          '&:hover': {
            backgroundColor:
              theme.colorScheme === 'dark'
                ? theme.colors.purplelux[6]
                : theme.colors.purplelux[5],
          },
        },
      }),
    },

    // ======================================================
    //                      CONFIRM MODAL
    // ======================================================
    ConfirmModal: {
      styles: (theme) => ({
        title: {
          color:
            theme.colorScheme === 'dark'
              ? theme.colors.purplelux[0]
              : theme.colors.purplelux[9],
          fontWeight: 700,
        },
        body: {
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.purplelux[8]
              : theme.colors.purplelux[1],
        },
        header: {
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.purplelux[9]
              : theme.colors.purplelux[1],
          borderBottom: `1px solid ${
            theme.colorScheme === 'dark'
              ? theme.colors.purplelux[7]
              : theme.colors.purplelux[2]
          }`,
          paddingTop: 14,
          paddingBottom: 14,
        },
        content: {
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.purplelux[9]
              : theme.colors.purplelux[0],
          border: `1px solid ${
            theme.colorScheme === 'dark'
              ? theme.colors.purplelux[7]
              : theme.colors.purplelux[2]
          }`,
        },
      }),
    },

    // ======================================================
    //                      ACTION ICON
    // ======================================================
    ActionIcon: {
      styles: (theme) => ({
        root: {
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.purplelux[7]
              : theme.colors.purplelux[1],
          color:
            theme.colorScheme === 'dark'
              ? theme.colors.purplelux[0]
              : theme.colors.purplelux[8],
          '&:hover': {
            backgroundColor:
              theme.colorScheme === 'dark'
                ? theme.colors.purplelux[6]
                : theme.colors.purplelux[2],
          },
        },
      }),
    },

    // ======================================================
    //                    TEXT INPUT
    // ======================================================
    TextInput: {
      styles: (theme) => ({
        input: {
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.purplelux[9]
              : theme.colors.purplelux[1],
          borderColor:
            theme.colorScheme === 'dark'
              ? theme.colors.purplelux[6]
              : theme.colors.purplelux[2],
          color:
            theme.colorScheme === 'dark'
              ? theme.colors.purplelux[0]
              : theme.colors.purplelux[8],
        },
      }),
    },

    // ======================================================
    //                    TEXTAREA
    // ======================================================
    Textarea: {
      styles: (theme) => ({
        input: {
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.purplelux[8]
              : theme.colors.purplelux[1],
          borderColor:
            theme.colorScheme === 'dark'
              ? theme.colors.purplelux[6]
              : theme.colors.purplelux[3],
          color:
            theme.colorScheme === 'dark'
              ? theme.colors.purplelux[0]
              : theme.colors.purplelux[9],
        },
      }),
    },

    // ======================================================
    //                         MODAL
    // ======================================================
    Modal: {
      styles: (theme) => {
        const dark = theme.colorScheme === 'dark'
        return {
          content: {
            backgroundColor: dark
              ? theme.colors.purplelux[9]
              : theme.colors.purplelux[1], // from pink-light → soft container color
            border: `1px solid ${
              dark ? theme.colors.purplelux[7] : theme.colors.purplelux[3]
            }`,
          },
          header: {
            backgroundColor: dark
              ? theme.colors.purplelux[9]
              : theme.colors.purplelux[1],
            borderBottom: `1px solid ${
              dark ? theme.colors.purplelux[7] : theme.colors.purplelux[3]
            }`,
          },
          title: {
            color: dark ? theme.colors.purplelux[0] : theme.colors.purplelux[8],
            fontWeight: 700,
          },
        }
      },
    },

    // ======================================================
    //                         CARD
    // ======================================================
    Card: {
      styles: (theme) => ({
        root: {
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.purplelux[8]
              : theme.colors.purplelux[1],
          borderColor:
            theme.colorScheme === 'dark'
              ? theme.colors.purplelux[6]
              : theme.colors.purplelux[2],
          color:
            theme.colorScheme === 'dark'
              ? theme.colors.purplelux[0]
              : theme.colors.purplelux[8],
        },
      }),
    },

    // ======================================================
    //                         MENU
    // ======================================================
    Menu: {
      styles: (theme) => ({
        dropdown: {
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.purplelux[9]
              : theme.colors.purplelux[1],
          borderColor:
            theme.colorScheme === 'dark'
              ? theme.colors.purplelux[6]
              : theme.colors.purplelux[2],
        },
        item: {
          color:
            theme.colorScheme === 'dark'
              ? theme.colors.purplelux[0]
              : theme.colors.purplelux[8],
          '&[data-hovered]': {
            backgroundColor:
              theme.colorScheme === 'dark'
                ? theme.colors.purplelux[7]
                : theme.colors.purplelux[2],
          },
        },
      }),
    },
  },
})

const App = ({ children }: AppProps) => {
  return (
    <MantineProvider theme={theme} colorSchemeManager={colorSchemeManager}>
      <ModalsProvider>
        <FatalErrorBoundary page={FatalErrorPage}>
          <RedwoodProvider titleTemplate="%PageTitle | EFVN">
            <AuthProvider>
              <RedwoodApolloProvider useAuth={useAuth}>
                {children}
              </RedwoodApolloProvider>
            </AuthProvider>
          </RedwoodProvider>
        </FatalErrorBoundary>
      </ModalsProvider>
    </MantineProvider>
  )
}

export default App
