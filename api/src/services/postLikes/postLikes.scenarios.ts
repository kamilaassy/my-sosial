import type { Prisma, PostLike } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.PostLikeCreateArgs>({
  postLike: {
    one: {
      data: {
        updatedAt: '2025-11-17T17:00:45.518Z',
        post: {
          create: {
            user: {
              create: {
                email: 'String735873',
                hashedPassword: 'String',
                salt: 'String',
              },
            },
          },
        },
        user: {
          create: {
            email: 'String5735615',
            hashedPassword: 'String',
            salt: 'String',
          },
        },
      },
    },
    two: {
      data: {
        updatedAt: '2025-11-17T17:00:45.561Z',
        post: {
          create: {
            user: {
              create: {
                email: 'String6172207',
                hashedPassword: 'String',
                salt: 'String',
              },
            },
          },
        },
        user: {
          create: {
            email: 'String7174478',
            hashedPassword: 'String',
            salt: 'String',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<PostLike, 'postLike'>
