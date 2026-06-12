import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Allow /print route to serve index.html (SPA routing)
    historyApiFallback: true,
  },
})
