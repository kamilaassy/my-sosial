import type { Prisma, User } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.UserCreateArgs>({
  user: {
    one: { data: { email: 'String7000877', hashedPassword: 'String' } },
    two: { data: { email: 'String2775498', hashedPassword: 'String' } },
  },
})

export type StandardScenario = ScenarioData<User, 'user'>
