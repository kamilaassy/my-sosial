import { useState } from 'react'

import { Box, Tooltip, Text, useMantineColorScheme, Badge } from '@mantine/core'
import {
  IconHome2,
  IconSearch,
  IconBell,
  IconPlus,
  IconUser,
  IconLogout,
  IconSun,
  IconMoon,
  IconShield,
} from '@tabler/icons-react'

import { navigate, routes, useLocation } from '@redwoodjs/router'
import { useQuery } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import { usePostComposer } from 'src/components/PostComposer/PostComposerContext'
import { GET_UNREAD_COUNT } from 'src/graphql/notifications'

export const Navbar = ({ disabled = false }) => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'
  const location = useLocation()
  const { currentUser, logOut } = useAuth()
  const { open: openComposer } = usePostComposer()

  /* =========================
     UNREAD NOTIFICATIONS
     ========================= */
  const { data } = useQuery(GET_UNREAD_COUNT, {
    pollInterval: 3000,
    skip: disabled,
  })
  const unread = disabled ? 0 : data?.unreadNotificationsCount || 0

  /* =========================
     THEME TOKENS
     ========================= */
  const glassBg = isDark ? 'rgba(20,20,28,0.55)' : 'rgba(255,255,255,0.65)'

  const glassBorder = isDark
    ? '1px solid rgba(255,255,255,0.08)'
    : '1px solid rgba(0,0,0,0.08)'

  const activeBg = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.06)'

  const iconColor = isDark ? 'rgba(255,255,255,0.88)' : 'rgba(0,0,0,0.78)'

  /* =========================
     NAV ITEM STYLE (FINAL)
     ========================= */
  const navItemStyle = {
    width: 52,
    height: 46,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14, // 🔥 rounded kotak
    cursor: 'pointer',
    transition: 'background 0.15s ease',
  }

  /* =========================
     ROUTE ACTIVE CHECK
     ========================= */
  const isRouteActive = (route?: string) => {
    if (!route) return false
    if (route === '/') return location.pathname === '/'
    return (
      location.pathname === route || location.pathname.startsWith(route + '/')
    )
  }

  /* =========================
     MENU DEFINITIONS
     ========================= */
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
      label: 'Create Post',
      icon: IconPlus,
      route: undefined,
      action: () => openComposer(),
    },
    {
      label: 'Notifications',
      icon: IconBell,
      route: '/notifications',
      action: () => navigate(routes.notifications()),
    },
    {
      label: 'Profile',
      icon: IconUser,
      route: currentUser?.id ? `/profile/${currentUser.id}` : undefined,
      action: () => navigate(routes.profile({ id: currentUser?.id })),
    },
  ]

  const adminMenu =
    currentUser?.role === 'admin'
      ? [
          {
            label: 'Admin Panel',
            icon: IconShield,
            route: '/admin',
            action: () => navigate('/admin/dashboard'),
          },
        ]
      : []

  const menu = [...baseMenu, ...adminMenu]

  const [hovered, setHovered] = useState<string | null>(null)

  /* =========================
     RENDER
     ========================= */
  return (
    <Box
      style={{
        width: 88,
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 9999,

        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '22px 0',

        background: glassBg,
        backdropFilter: 'blur(22px)',
        WebkitBackdropFilter: 'blur(22px)',
        borderRight: glassBorder,

        pointerEvents: disabled ? 'none' : 'auto',
        opacity: disabled ? 0.45 : 1,
      }}
    >
      {/* LOGO */}
      <Text
        fw={900}
        size="xl"
        style={{
          color: iconColor,
          letterSpacing: 1.2,
          marginBottom: 6,
        }}
      >
        EFVN
      </Text>

      {/* ADMIN BADGE */}
      {currentUser?.role === 'admin' && (
        <Badge
          size="xs"
          color="purplelux"
          variant="filled"
          mb={10}
          style={{ fontWeight: 700 }}
        >
          ADMIN
        </Badge>
      )}

      {/* THEME TOGGLE */}
      <Box
        onClick={!disabled ? toggleColorScheme : undefined}
        style={{
          ...navItemStyle,
          color: iconColor,
        }}
      >
        {isDark ? <IconSun size={20} /> : <IconMoon size={20} />}
      </Box>

      {/* NAV ITEMS */}
      <Box
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 22,
        }}
      >
        {menu.map((item) => {
          const isActive = isRouteActive(item.route)

          return (
            <Tooltip
              key={item.label}
              label={item.label}
              position="right"
              withArrow
              offset={12}
              withinPortal
              zIndex={10000}
            >
              <Box
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box
                  onClick={!disabled ? item.action : undefined}
                  onMouseEnter={() => setHovered(item.label)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    ...navItemStyle,
                    background:
                      isActive || hovered === item.label
                        ? activeBg
                        : 'transparent',
                    color: iconColor,
                  }}
                >
                  <item.icon size={26} stroke={1.7} />
                </Box>

                {/* NOTIFICATION BADGE */}
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
                      alignItems: 'center',
                      justifyContent: 'center',
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

      {/* LOGOUT */}
      <Tooltip
        label="Logout"
        position="right"
        withArrow
        withinPortal
        zIndex={10000}
      >
        <Box
          onClick={async () => {
            await logOut()
            navigate(routes.login())
          }}
          style={{
            ...navItemStyle,
            color: iconColor,
          }}
        >
          <IconLogout size={26} stroke={1.7} />
        </Box>
      </Tooltip>
    </Box>
  )
}
