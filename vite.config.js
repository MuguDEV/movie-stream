import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Whether to polyfill `node:` protocol imports.
      protocolImports: true,
    }),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Movies',
        short_name: 'Movies',
        description: 'Stream your favorite movies',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  server: {
    middlewareMode: false,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173
    },
    proxy: {
      '/seedr': {
        target: 'https://www.seedr.cc',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/seedr/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Rewrite x-seedr-cookie to Cookie header
            const seedrCookie = req.headers['x-seedr-cookie'];
            if (seedrCookie) {
              proxyReq.setHeader('Cookie', seedrCookie);
              // Optional: Remove the custom header if you want
              // proxyReq.removeHeader('x-seedr-cookie');
            }
          });
        }
      },
      '/yts': {
        target: 'https://yts.bz/api/v2',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/yts/, ''),
      },
      '/yts-bz': {
        target: 'https://yts.bz',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/yts-bz/, ''),
      }
    }
  }
})
