import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    host: true,
    open: true,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  optimizeDeps: {
    include: ['element-plus', '@element-plus/icons-vue'],
    exclude: ['monaco-editor'],
  },
  define: {
    global: 'globalThis',
    // 禁用 Monaco Editor 的 Web Worker 功能
    'process.env.MONACO_EDITOR_DISABLE_WORKERS': 'true',
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          monaco: ['monaco-editor'],
        },
      },
    },
  },
})
