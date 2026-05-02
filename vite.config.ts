import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    proxy: {
      // This redirects frontend calls from http://localhost:5173/api 
      // to your actual backend server
      '/api': {
        target: 'http://localhost:5000', // CHANGE THIS to your backend port (e.g., 5000 or 8000)
        changeOrigin: true,
        secure: false,
      }
    }
  }
})