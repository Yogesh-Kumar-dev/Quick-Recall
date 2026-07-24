import path from 'node:path';
import { defineConfig } from 'vitest/config';

// Minimal Vitest setup: pure-logic unit tests only (no jsdom, no React rendering).
export default defineConfig({
  resolve: {
    // Mirror the tsconfig `@/* -> src/*` alias so imports like `@/data/...` resolve in tests.
    alias: { '@': path.resolve(__dirname, './src') }
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts']
  }
});
