import { ReactNode } from 'react'

import { Card, useMantineColorScheme, MantineRadius } from '@mantine/core'

type GlassCardProps = {
  children: ReactNode
  radius?: MantineRadius
  padding?: string | number
  blur?: number
  opacityLight?: number
  opacityDark?: number
  mb?: number | string
  style?: React.CSSProperties
  onClick?: () => void
}

export function GlassCard({
  children,
  radius = 22,
  padding = 'lg',
  blur = 16,
  opacityLight = 0.42,
  opacityDark = 0.42,
  mb = 0,
  style,
}: GlassCardProps) {
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'

  return (
    <Card
      radius={radius}
      p={padding}
      mb={mb}
      style={{
        background: isDark
          ? `rgba(8,8,12,${opacityDark})`
          : `rgba(255,255,255,${opacityLight})`,

        backdropFilter: `blur(${blur}px) saturate(140%)`,
        WebkitBackdropFilter: `blur(${blur}px) saturate(140%)`,

        border: isDark
          ? '1px solid rgba(255,255,255,0.08)'
          : '1px solid rgba(255,255,255,0.45)',

        ...style,
      }}
    >
      {children}
    </Card>
  )
}
