import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // 👇 PERBAIKAN DI SINI: Tambahkan 'coblosaku.png' agar ikut disimpan oleh sistem PWA
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg', 'coblosaku.png'], 
      manifest: {
        name: 'Coblos Aku - E-Voting',
        short_name: 'CoblosAku',
        description: 'Aplikasi E-Voting Terpercaya',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: '/coblosaku.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/coblosaku.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/coblosaku.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  base: '/', 
})