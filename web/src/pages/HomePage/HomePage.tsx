import { AppShell } from '@mantine/core'

import Feed from 'src/components/Feed/Feed'
import Navbar from 'src/components/Navbar/Navbar'

const HomePage = () => {
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <Navbar />
      <AppShell.Main>
        <Feed />
      </AppShell.Main>
    </AppShell>
  )
}

export default HomePage
