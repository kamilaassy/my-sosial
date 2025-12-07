import type { Prisma, Follow } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.FollowCreateArgs>({
  follow: {
    one: {
      data: {
        follower: {
          create: {
            email: 'String288202',
            hashedPassword: 'String',
            salt: 'String',
          },
        },
        following: {
          create: {
            email: 'String3229297',
            hashedPassword: 'String',
            salt: 'String',
          },
        },
      },
    },
    two: {
      data: {
        follower: {
          create: {
            email: 'String4398373',
            hashedPassword: 'String',
            salt: 'String',
          },
        },
        following: {
          create: {
            email: 'String4509615',
            hashedPassword: 'String',
            salt: 'String',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Follow, 'follow'>
