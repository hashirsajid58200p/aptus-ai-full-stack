import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  // Production build is served by the main site at /demo/2/
  base: command === 'build' ? '/demo/2/' : '/',
  plugins: [react()],
  server: {
    port: 3005
  }
}))
