import { Card, Skeleton, Group } from '@mantine/core'

export const FeedSkeleton = () => (
  <Card radius="lg" shadow="md" withBorder p="lg" mb="md">
    <Group mb="sm">
      <Skeleton height={40} circle />
      <Skeleton height={14} width="40%" />
    </Group>

    <Skeleton height={12} width="90%" mb="xs" />
    <Skeleton height={12} width="80%" mb="xs" />
    <Skeleton height={200} radius="md" mt="sm" />
  </Card>
)
