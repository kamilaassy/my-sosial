import dns from 'dns'

import { defineConfig, loadEnv, UserConfig } from 'vite'

import redwood from '@redwoodjs/vite'

dns.setDefaultResultOrder('verbatim')

export default defineConfig(({ mode }) => {
  // Load all environment variables, including VITE_*
  const env = loadEnv(mode, process.cwd(), '')

  const viteConfig: UserConfig = {
    plugins: [redwood()],
    define: {
      // Make env variables available to the client
      'import.meta.env': env,
    },
  }

  return viteConfig
})
