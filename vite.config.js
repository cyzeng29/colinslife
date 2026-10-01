import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The resume link only renders once public/resume.pdf exists.
// Checked at startup, so restart `npm run dev` after adding the file.
const resumeAvailable = existsSync(fileURLToPath(new URL('./public/resume.pdf', import.meta.url)))

export default defineConfig({
  plugins: [react()],
  define: {
    __RESUME_AVAILABLE__: JSON.stringify(resumeAvailable),
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
  server: {
    watch: {
      usePolling: true,
    },
  },
})
