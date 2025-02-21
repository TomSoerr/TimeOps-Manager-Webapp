import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  base: '/',
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['pc.fritz.box', 'localhost'],
  },
});
