import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev
export default defineConfig({
  plugins: [react()],
  // 🚀 FIXED: Forces Vite to lock onto port 5173 and reject random shifts
  server: {
    port: 5173,
    strictPort: true, 
  }
})
