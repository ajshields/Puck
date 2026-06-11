import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import fs from 'fs';
import path from 'path';


export default defineConfig({
  base: './',
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
      '/yahoo': {
        target: 'https://api.login.yahoo.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/yahoo/, ''),
      },
      '/backend': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/backend/, '')
      },
      /*'/fantasy': {
        target: 'https://fantasysports.yahooapis.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/fantasy/, ''),
      },*/
      /*'/edgeApi': {
        target: 'https://edge.api.brightcove.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/edgeApi/, ''),
      },*/
    },
  },
})
