import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        webDev: resolve(__dirname, 'web-development.html'),
        digitalMarketing: resolve(__dirname, 'digital-marketing.html'),
        contentCreation: resolve(__dirname, 'content-creation.html'),
        leadGen: resolve(__dirname, 'lead-generation.html'),
        customSoftware: resolve(__dirname, 'custom-software.html'),
      },
    },
  },
})
