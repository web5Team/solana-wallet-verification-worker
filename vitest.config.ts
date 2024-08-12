/// <reference types="vitest" />
import { defineConfig } from 'vite'

process.loadEnvFile('.env.test')

export default defineConfig({
  test: {
    include: ['test/**/*.ts'],
    environment: 'node',
  },
})
