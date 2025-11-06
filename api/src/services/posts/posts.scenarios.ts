import type { Prisma, Post } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.PostCreateArgs>({
  post: {
    one: {
      data: {
        author: {
          create: { email: 'String3499316', hashedPassword: 'String' },
        },
      },
    },
    two: {
      data: {
        author: {
          create: { email: 'String9788623', hashedPassword: 'String' },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Post, 'post'>
