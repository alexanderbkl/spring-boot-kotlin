import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://92.189.212.214:8080',
    },
    port: 3000,
  },
  plugins: [react()],
})
