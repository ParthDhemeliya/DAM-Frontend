import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // Redux chunk
          redux: ['@reduxjs/toolkit', 'react-redux'],
          // UI components chunk
          ui: ['@heroicons/react'],
        },
        // Custom chunk naming for better debugging
        chunkFileNames: () => {
          return `js/[name]-[hash].js`
        },
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || []
          const ext = info[info.length - 1]
          if (/\.(css)$/.test(assetInfo.name || '')) {
            return `css/[name]-[hash].${ext}`
          }
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(assetInfo.name || '')) {
            return `images/[name]-[hash].${ext}`
          }
          return `assets/[name]-[hash].${ext}`
        },
      },
    },
    // Disable source maps for production
    sourcemap: false,
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Production optimizations
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  // Development server options (only for dev mode)
  server: {
    port: 3000,
    open: false,
    hmr: true,
  },
  // Preview server options
  preview: {
    port: 4173,
    open: false,
  },
})
