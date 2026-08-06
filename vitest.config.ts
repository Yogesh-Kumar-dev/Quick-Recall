import path from 'node:path';
import { defineConfig } from 'vitest/config';

import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

const isCI = process.env.CI === 'true';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          environment: 'node',
          name: 'unit',
          include: ['src/**/*.test.ts']
        }
      },
      {
        extends: true,
        test: {
          environment: 'jsdom',
          name: 'component',
          include: ['src/**/*.test.tsx'],
          setupFiles: ['./vitest.setup.ts']
        }
      },
      ...(!isCI
        ? [
            {
              extends: true as const,
              plugins: [
                storybookTest({
                  configDir: path.join(dirname, '.storybook')
                })
              ],
              optimizeDeps: {
                include: [
                  'lucide-react',
                  'class-variance-authority',
                  '@base-ui/react/avatar',
                  '@base-ui/react/button',
                  '@base-ui/react/dialog',
                  '@base-ui/react/input',
                  '@base-ui/react/menu',
                  '@base-ui/react/select',
                  '@base-ui/react/tooltip',
                  'storybook/theming'
                ]
              },
              test: {
                name: 'storybook',
                browser: {
                  enabled: true,
                  headless: true,
                  provider: 'playwright',
                  instances: [{ browser: 'chromium' }]
                }
              }
            }
          ]
        : [])
    ]
  }
});
