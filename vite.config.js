import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // GitHub Pages のプロジェクトサイト（/Claude-Code-app/ 配下）で配信するためのベースパス
  base: '/Claude-Code-app/',
  // バドミントン(index.html)と睡眠分析(sleep.html)を独立した別ページとしてビルド
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        sleep: resolve(__dirname, 'sleep.html'),
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icon.svg', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'ストリング管理くん',
        short_name: 'ストリング管理くん',
        description: 'バドミントンストリングのテンション・交換時期を管理するアプリ',
        theme_color: '#2563eb',
        background_color: '#f8fafc',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/Claude-Code-app/',
        start_url: '/Claude-Code-app/',
        lang: 'ja',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.open-meteo\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'weather-api',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 30 },
            },
          },
        ],
      },
    }),
  ],
})
