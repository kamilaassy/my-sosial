import { ReactNode } from 'react'

import { Stack } from '@mantine/core'

import { GlassCard } from './GlassCard'

type AuthCardProps = {
  children: ReactNode
}

export function AuthCard({ children }: AuthCardProps) {
  return (
    <GlassCard
      padding={50}
      radius={28}
      style={{
        width: 480,
        minHeight: 520,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Stack gap={24} style={{ width: '100%' }}>
        {children}
      </Stack>
    </GlassCard>
  )
}
