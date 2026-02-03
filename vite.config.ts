import { defineConfig } from 'vite'
import path from 'path'
import net from 'net'
import { fileURLToPath } from 'url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DEV_SERVER_HOST = process.env.VITE_DEV_SERVER_HOST ?? '127.0.0.1'
const DEV_SERVER_PORT =
  Number.parseInt(process.env.VITE_DEV_SERVER_PORT ?? '5173', 10) || 5173
const HMR_HOST = process.env.VITE_HMR_HOST ?? DEV_SERVER_HOST

const MAX_PORT_SEARCH = 20

const canListen = (host: string, port: number) =>
  new Promise<boolean>((resolve) => {
    const server = net
      .createServer()
      .once('error', (err: NodeJS.ErrnoException) => {
        if (err.code === 'EADDRINUSE' || err.code === 'EACCES') {
          resolve(false)
        } else {
          resolve(false)
        }
      })
      .once('listening', () => {
        server.close(() => resolve(true))
      })
      .listen(port, host)
  })

const resolveDevServerPort = async (host: string, startPort: number) => {
  for (let offset = 0; offset <= MAX_PORT_SEARCH; offset += 1) {
    const port = startPort + offset
    // Use IPv4 loopback when host is localhost to avoid IPv6 binding issues on Windows.
    const checkHost = host === 'localhost' ? '127.0.0.1' : host
    // eslint-disable-next-line no-await-in-loop
    if (await canListen(checkHost, port)) return port
  }
  return startPort
}

export default defineConfig(async () => {
  const resolvedDevPort = await resolveDevServerPort(
    DEV_SERVER_HOST,
    DEV_SERVER_PORT
  )

  return {
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
    // Default to 127.0.0.1 for Windows compatibility.
    // Set VITE_DEV_SERVER_HOST=0.0.0.0 in Docker or when you need LAN access.
    host: DEV_SERVER_HOST,
    port: resolvedDevPort,
    hmr: HMR_HOST
      ? {
          host: HMR_HOST,
          clientPort: resolvedDevPort,
        }
      : undefined,
    headers: {
      'Cache-Control': 'no-store',
    },
  },
  base: '/', // Use absolute paths for browser router to work correctly on server
  }
})
