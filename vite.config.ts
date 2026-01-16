import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
      // Explicitly resolve jspdf
      'jspdf': path.resolve(__dirname, './node_modules/jspdf/dist/jspdf.es.min.js'),
    },
    dedupe: ['jspdf'],
    conditions: ['import', 'module', 'browser', 'default'],
  },
  optimizeDeps: {
    include: ['jspdf', 'jspdf-autotable'],
    exclude: [],
  },
  build: {
    commonjsOptions: {
      include: [/jspdf/, /node_modules/],
    },
  },
  server: {
    host: '0.0.0.0', // Allow external connections (required for Docker)
    port: 5173,
  },
  base: './', // Thêm dòng này
})