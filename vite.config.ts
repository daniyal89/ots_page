import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use a relative base so built asset paths work on Netlify
export default defineConfig({
  base: './',
  plugins: [react()],
})
