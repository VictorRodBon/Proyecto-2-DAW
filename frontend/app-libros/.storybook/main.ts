import type { StorybookConfig } from '@storybook/react-vite'

import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx|js|jsx)'],
  addons: [],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: (config) => {
    const alias = { find: '@', replacement: path.resolve(__dirname, '../src') }
    if (Array.isArray(config.resolve?.alias)) {
      config.resolve!.alias!.push(alias)
    } else {
      config.resolve!.alias = { ...(config.resolve?.alias as Record<string, string>), '@': path.resolve(__dirname, '../src') }
    }
    return config
  },
}

export default config
