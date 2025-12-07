import { Box, Alert } from '@mantine/core'
import { IconBan } from '@tabler/icons-react'

import { useAuth } from 'src/auth'
import { Navbar } from 'src/components/Navbar/Navbar'

export default function MainLayout({ children }) {
  const { currentUser } = useAuth()

  // Prevent admins from receiving "banned" UX lock
  const isBanned =
    currentUser?.role !== 'admin' && currentUser?.isBanned === true

  return (
    <Box
      style={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
      }}
    >
      {/* NAVIGATION */}
      <Navbar disabled={isBanned} />

      {/* PAGE CONTENT WRAPPER */}
      <Box
        style={{
          flex: 1,
          paddingLeft: 90,
          paddingTop: 20,
          paddingBottom: 20,
          display: 'flex',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* CONTENT */}
        <Box
          style={{
            width: '100%',
            maxWidth: 'var(--page-width)',
            paddingLeft: 16,
            paddingRight: 16,

            pointerEvents: isBanned ? 'none' : 'auto',
            opacity: isBanned ? 0.3 : 1,
            filter: isBanned ? 'blur(1px)' : 'none',
            transition: '0.25s ease',
          }}
        >
          {children}
        </Box>

        {/* BANNED OVERLAY */}
        {isBanned && (
          <Box
            style={{
              position: 'absolute',
              top: 30,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '90%',
              maxWidth: 550,
              zIndex: 50,
            }}
          >
            <Alert
              variant="filled"
              color="red"
              radius="md"
              title="Account Suspended"
              icon={<IconBan size={20} />}
              style={{
                fontWeight: 600,
                fontSize: 15,
              }}
            >
              Your account has been banned. If you believe this was a mistake,
              please contact support.
            </Alert>
          </Box>
        )}
      </Box>
    </Box>
  )
}
