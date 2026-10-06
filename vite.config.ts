import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Permite despliegue directo en subdirectorios de GitHub Pages o servidores estáticos
  server: {
    port: 5173,
    host: true,
    proxy: { '/api': { target: 'http://127.0.0.1:3001', changeOrigin: false } }
  }
});
