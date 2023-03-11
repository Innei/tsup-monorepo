import path from 'path'
import tsPath from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

const __dirname = import.meta.url.slice(7, import.meta.url.lastIndexOf('/'))
export default defineConfig({
  test: {
    globals: true,
    include: ['packages/**/*.(spec|test).ts'],
    exclude: ['node_modules/**'],
  },

  plugins: [tsPath()],
  resolve: {
    alias: {
      '@xhs/xswr-core/src': path.resolve(__dirname, 'packages/core/src'),
      '@xhs/xswr-core': path.resolve(__dirname, 'packages/core/src'),
      '@xhs/xswr-utils/src': path.resolve(__dirname, 'packages/utils/src'),
      '@xhs/xswr-utils': path.resolve(__dirname, 'packages/utils/src'),
    },
  },
  define: {
    __DEV__: false,
  },
})
