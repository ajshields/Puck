import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://api-web.nhle.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/restApi': {
        target: 'https://api.nhle.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/restApi/, ''),
      },
      '/dailyFaceoff': {
        target: 'https://www.dailyfaceoff.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dailyFaceoff/, ''),
      },
      '/puckPedia': {
        target: 'https://puckpedia.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/puckPedia/, ''),
      },
      /*'/edgeApi': {
        target: 'https://edge.api.brightcove.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/edgeApi/, ''),
      },*/
    },
  },
})
