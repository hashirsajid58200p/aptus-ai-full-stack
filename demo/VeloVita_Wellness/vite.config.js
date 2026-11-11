import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  // Production build is served by the main site at /demo/3/
  base: command === 'build' ? '/demo/3/' : '/',
  plugins: [react()],
  server: {
    port: 3006
  }
}))
