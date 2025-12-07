import type { Prisma, Comment } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.CommentCreateArgs>({
  comment: {
    one: {
      data: {
        content: 'String',
        user: {
          create: {
            email: 'String4385112',
            hashedPassword: 'String',
            salt: 'String',
          },
        },
        post: {
          create: {
            user: {
              create: {
                email: 'String1392083',
                hashedPassword: 'String',
                salt: 'String',
              },
            },
          },
        },
      },
    },
    two: {
      data: {
        content: 'String',
        user: {
          create: {
            email: 'String5526999',
            hashedPassword: 'String',
            salt: 'String',
          },
        },
        post: {
          create: {
            user: {
              create: {
                email: 'String7841535',
                hashedPassword: 'String',
                salt: 'String',
              },
            },
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Comment, 'comment'>
