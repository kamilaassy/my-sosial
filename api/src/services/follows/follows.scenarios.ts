import type { Prisma, Follow } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.FollowCreateArgs>({
  follow: {
    one: {
      data: {
        follower: {
          create: { email: 'String9176495', hashedPassword: 'String' },
        },
        following: {
          create: { email: 'String5343955', hashedPassword: 'String' },
        },
      },
    },
    two: {
      data: {
        follower: {
          create: { email: 'String3413270', hashedPassword: 'String' },
        },
        following: {
          create: { email: 'String5129688', hashedPassword: 'String' },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Follow, 'follow'>
