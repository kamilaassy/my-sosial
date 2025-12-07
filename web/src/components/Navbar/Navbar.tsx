import {
  Box,
  ActionIcon,
  Tooltip,
  Text,
  useMantineTheme,
  useMantineColorScheme,
  Badge,
} from '@mantine/core'
import {
  IconHome2,
  IconSearch,
  IconMessageCircle,
  IconBell,
  IconPlus,
  IconUser,
  IconLogout,
  IconSettings,
  IconSun,
  IconMoon,
  IconShield,
} from '@tabler/icons-react'

import { navigate, routes, useLocation } from '@redwoodjs/router'
import { useQuery } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import { GET_UNREAD_COUNT } from 'src/graphql/notifications'

export const Navbar = ({ disabled = false }) => {
  const theme = useMantineTheme()
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'
  const location = useLocation()
  const { currentUser, logOut } = useAuth()

  // UNREAD NOTIFICATION (auto-disabled if banned)
  const { data } = useQuery(GET_UNREAD_COUNT, {
    pollInterval: 3000,
    skip: disabled,
  })
  const unread = disabled ? 0 : data?.unreadNotificationsCount || 0

  // PurpleLux tokens
  const bg = isDark ? theme.colors.purplelux[9] : theme.colors.purplelux[1]
  const border = isDark ? theme.colors.purplelux[7] : theme.colors.purplelux[3]
  const iconColor = isDark
    ? theme.colors.purplelux[1]
    : theme.colors.purplelux[9]

  /* =========================================================
     ORIGINAL MENU ITEMS (yang kamu punya)
     ========================================================= */
  const baseMenu = [
    {
      label: 'Home',
      icon: IconHome2,
      route: '/',
      action: () => navigate(routes.home()),
    },
    {
      label: 'Search',
      icon: IconSearch,
      route: '/search',
      action: () => navigate('/search'),
    },
    {
      label: 'Messages',
      icon: IconMessageCircle,
      route: '/messages',
      action: () => navigate('/messages'),
    },
    {
      label: 'Notifications',
      icon: IconBell,
      route: '/notifications',
      action: () => navigate(routes.notifications()),
    },
    {
      label: 'Create Post',
      icon: IconPlus,
      route: '/create',
      action: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
    },
    {
      label: 'Profile',
      icon: IconUser,
      route: currentUser?.id ? `/profile/${currentUser.id}` : '',
      action: () => navigate(routes.profile({ id: currentUser?.id })),
    },
    {
      label: 'Settings',
      icon: IconSettings,
      route: '/settings',
      action: () => navigate('/settings'),
    },
  ]

  /* =========================================================
     ADMIN MENU (TAMBAHAN)
     ========================================================= */
  const adminMenu =
    currentUser?.role?.toLowerCase() === 'admin'
      ? [
          {
            label: 'Admin Panel',
            icon: IconShield,
            route: '/admin/dashboard',
            action: () => navigate('/admin/dashboard'),
          },
        ]
      : []

  const menu = [...baseMenu, ...adminMenu]

  /* =========================================================
     RENDER
     ========================================================= */
  return (
    <Box
      style={{
        width: 90,
        height: '100vh',
        backgroundColor: bg,
        borderRight: `1px solid ${border}`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '22px 0',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 9999,

        // banned mode
        pointerEvents: disabled ? 'none' : 'auto',
        opacity: disabled ? 0.4 : 1,
        filter: disabled ? 'grayscale(60%)' : 'none',
      }}
    >
      {/* Logo */}
      <Text
        fw={900}
        size="xl"
        style={{
          color: iconColor,
          fontFamily: 'Poppins',
          letterSpacing: 1,
        }}
      >
        EFVN
      </Text>

      {/* Admin Badge */}
      {currentUser?.role === 'admin' && (
        <Badge
          variant="filled"
          color="purplelux"
          style={{
            textTransform: 'uppercase',
            marginTop: 4,
            marginBottom: 10,
            fontSize: 10,
            fontWeight: 700,
          }}
        >
          Admin
        </Badge>
      )}

      {/* Theme Toggle */}
      <ActionIcon
        radius="xl"
        size={34}
        variant="light"
        onClick={!disabled ? toggleColorScheme : undefined}
        style={{
          color: iconColor,
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        {isDark ? <IconSun size={20} /> : <IconMoon size={20} />}
      </ActionIcon>

      {/* Navigation Icons */}
      <Box
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 24,
        }}
      >
        {menu.map((item) => {
          const isActive =
            location.pathname === item.route ||
            location.pathname.startsWith(item.route)

          return (
            <Tooltip
              key={item.label}
              label={item.label}
              position="right"
              withArrow
            >
              <Box style={{ position: 'relative' }}>
                <ActionIcon
                  radius="xl"
                  size={46}
                  onClick={!disabled ? item.action : undefined}
                  style={{
                    background: isActive
                      ? isDark
                        ? theme.colors.purplelux[7]
                        : theme.colors.purplelux[3]
                      : 'transparent',
                    color: iconColor,
                    borderRadius: 14,
                    transition: '0.15s ease',
                  }}
                >
                  <item.icon size={26} stroke={1.7} />
                </ActionIcon>

                {/* Unread notification badge */}
                {item.label === 'Notifications' && unread > 0 && (
                  <Box
                    style={{
                      position: 'absolute',
                      top: -4,
                      right: -4,
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      background: '#ff3b30',
                      color: 'white',
                      fontSize: 11,
                      fontWeight: 700,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {unread}
                  </Box>
                )}
              </Box>
            </Tooltip>
          )
        })}
      </Box>

      {/* Logout (always active even if banned) */}
      <Tooltip label="Logout" position="right">
        <ActionIcon
          radius="xl"
          size={46}
          onClick={logOut}
          style={{
            color: iconColor,
            pointerEvents: 'auto',
          }}
        >
          <IconLogout size={26} stroke={1.7} />
        </ActionIcon>
      </Tooltip>
    </Box>
  )
}
