// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true, // スマホ実機からのアクセスを許可
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});