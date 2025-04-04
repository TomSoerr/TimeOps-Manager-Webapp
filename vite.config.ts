import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import fs from 'fs';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      includeAssets: [
        'favicon.ico',
        'pwa-192x192.png',
        'pwa-512x512.png',
        'apple-touch-icon.png',
        'mask-icon.svg',
      ],
      manifest: {
        name: 'TimeOps Manager',
        short_name: 'TimeOps',
        description: 'Time Management Application',
        theme_color: '#615fff',
        background_color: '#fcf9fa',
        orientation: 'portrait',
        handle_links: 'preferred',
        categories: ['productivity'],
        display: 'standalone',
        display_override: ['standalone', 'window-controls-overlay'],
        launch_handler: {
          client_mode: ['navigate-existing', 'auto'],
        },
        // start_url: '/',
        start_url: '/TimeOps-Manager-Webapp/',
        id: '/',
        scope: '/',
        screenshots: [
          {
            src: 'mobile-screenshot.png',
            sizes: '750x1334',
            type: 'image/png',
            form_factor: 'narrow',
          },
          {
            src: 'desktop-screenshot.png',
            sizes: '1920x1080',
            type: 'image/png',
            form_factor: 'wide',
          },
        ],
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 6000000,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  // base: '/',
  base: '/TimeOps-Manager-Webapp/',
  server: {
    host: '0.0.0.0',
    port: 5173,

    // https: {
    //   key: fs.readFileSync('192.168.178.43-key.pem'),
    //   cert: fs.readFileSync('192.168.178.43.pem'),
    // },
  },
  build: {
    outDir: 'dist',
    manifest: true,
    rollupOptions: {
      input: {
        main: '/index.html',
      },
    },
  },
});
