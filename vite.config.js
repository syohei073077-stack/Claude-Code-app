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
      // マニフェストはページごとに用意する（public/manifest.webmanifest =
      // バドミントン, public/sleep.webmanifest = 睡眠分析）。各HTMLで個別にリンクし、
      // それぞれ独立したPWAとしてホーム追加できるようにする。
      manifest: false,
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
