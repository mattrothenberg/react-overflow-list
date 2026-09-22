import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react({ jsxRuntime: 'classic' })],
  // Don't pick up the root postcss.config.js, which belongs to Storybook.
  css: { postcss: {} },
});
