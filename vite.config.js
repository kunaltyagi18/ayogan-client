import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Let @vitejs/plugin-react handle JSX through its Babel pipeline. This
  // avoids Vite's esbuild transform worker crashing during HMR on Windows.
  esbuild: false,
  optimizeDeps: {
    // Keep discovery off on Windows, but explicitly pre-bundle the packages
    // that must be served as browser-compatible ESM.
    noDiscovery: true,
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      'react-router-dom',
      'lucide-react',
      'react-hot-toast',
    ],
  },
})
