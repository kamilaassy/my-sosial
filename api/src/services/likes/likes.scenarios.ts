import type { Prisma, Like } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.LikeCreateArgs>({
  like: {
    one: {
      data: {
        user: { create: { email: 'String6300014', hashedPassword: 'String' } },
        post: {
          create: {
            author: {
              create: { email: 'String8518857', hashedPassword: 'String' },
            },
          },
        },
      },
    },
    two: {
      data: {
        user: { create: { email: 'String7960978', hashedPassword: 'String' } },
        post: {
          create: {
            author: {
              create: { email: 'String8937252', hashedPassword: 'String' },
            },
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Like, 'like'>
