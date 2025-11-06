import type { Prisma, Comment } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.CommentCreateArgs>({
  comment: {
    one: {
      data: {
        content: 'String',
        post: {
          create: {
            author: {
              create: { email: 'String4104035', hashedPassword: 'String' },
            },
          },
        },
        author: {
          create: { email: 'String4232608', hashedPassword: 'String' },
        },
      },
    },
    two: {
      data: {
        content: 'String',
        post: {
          create: {
            author: {
              create: { email: 'String6329564', hashedPassword: 'String' },
            },
          },
        },
        author: {
          create: { email: 'String3117209', hashedPassword: 'String' },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Comment, 'comment'>
