import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const backendUrl = 'http://localhost:8081'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  server: {
    port: 5174,
    proxy: {
      '/auth': { target: backendUrl, changeOrigin: true },
      '/users': { target: backendUrl, changeOrigin: true },
      '/flights': { target: backendUrl, changeOrigin: true },
    },
  },
})
