import { defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

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
    },
    dedupe: ['jspdf', 'docx'],
    conditions: ['browser', 'import', 'module', 'default'],
    // Explicitly resolve modules for better compatibility
    mainFields: ['browser', 'module', 'jsnext:main', 'jsnext', 'main'],
    // Preserve symlinks to help with module resolution in Docker
    preserveSymlinks: false,
  },
  optimizeDeps: {
    include: ['jspdf', 'jspdf-autotable', 'docx', 'file-saver'],
    exclude: [],
    esbuildOptions: {
      target: 'esnext',
      mainFields: ['browser', 'module', 'main'],
      platform: 'browser',
    },
    force: true, // Force re-optimization
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: true, // Use esbuild minify (default, faster and no extra dependency needed)
    commonjsOptions: {
      include: [/jspdf/, /docx/, /node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      external: [],
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    host: '0.0.0.0', // Allow external connections (required for Docker)
    port: 5173,
  },
  base: '/', // Use absolute paths for browser router to work correctly on server
})