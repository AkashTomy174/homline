import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Built into Django's static dir so WhiteNoise serves it; Django serves index.html for every SPA route.
export default defineConfig({
  plugins: [react()],
  base: '/static/app/',
  build: { outDir: '../static/app', emptyOutDir: true },
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://127.0.0.1:8000',
      '/staff': 'http://127.0.0.1:8000',
      '/admin': 'http://127.0.0.1:8000',
      '/static/images': 'http://127.0.0.1:8000',
      '/static/css': 'http://127.0.0.1:8000',
    },
  },
});
