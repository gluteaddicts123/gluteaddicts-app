import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name:             'Glute Addicts Medellín',
        short_name:       'Glute Addicts',
        description:      'Reserva tus clases de Jumping y Glúteos en El Poblado, Medellín.',
        theme_color:      '#c9a84c',
        background_color: '#0a0a0a',
        display:          'standalone',
        orientation:      'portrait',
        start_url:        '/',
        scope:            '/',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
        screenshots: [
          { src: '/screenshot.png', sizes: '390x844', type: 'image/png', form_factor: 'narrow' }
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            // Cache WordPress REST API responses for 5 min
            urlPattern: /^https:\/\/gluteaddictsmedellin\.co\/wp-json\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 300 },
            },
          },
        ],
      },
    }),
  ],
});
