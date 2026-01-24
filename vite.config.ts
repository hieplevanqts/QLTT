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
      'figma:asset': path.resolve(__dirname, './src/assets')
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
    chunkSizeWarningLimit: 2000,
    commonjsOptions: {
      include: [/jspdf/, /docx/, /node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      external: [],
      output: {
        manualChunks: (id) => {
          if (!id.includes('node_modules')) {
            if (id.includes('/src/modules/system-admin/')) return 'system-admin';
            if (id.includes('/src/modules/i-todolist/')) return 'todolist';
            if (id.includes('/src/modules/kpi-qltt/')) return 'kpi';
            if (id.includes('/src/pages/lead-risk/') || id.includes('/src/app/pages/lead-risk/')) return 'lead-risk';
            if (id.includes('/src/app/pages/evidence/')) return 'evidence';
            if (id.includes('/src/app/pages/plans/') || id.includes('/src/app/pages/inspections/')) return 'plans';
            if (id.includes('/src/pages/system/') || id.includes('/src/pages/Admin')) return 'admin-legacy';
            return undefined;
          }
          if (id.includes('/leaflet/')) return 'leaflet';
          if (id.includes('/lucide-react/')) return 'icons';
          if (id.includes('/supabase/')) return 'supabase';
          if (id.includes('/html2canvas/') || id.includes('/jspdf') || id.includes('/docx') || id.includes('/xlsx')) {
            return 'docs';
          }
          return 'vendor';
        },
      },
    },
  },
  server: {
    host: '0.0.0.0', // Allow external connections (required for Docker)
    port: 5173,
  },
  base: '/', // Use absolute paths for browser router to work correctly on server
})
