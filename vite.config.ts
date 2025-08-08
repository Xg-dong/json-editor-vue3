import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      copyDtsFiles: true,
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'utils/index': resolve(__dirname, 'src/utils/index.ts'),
        JsonEditor: resolve(__dirname, 'src/JsonEditor.vue'),
      },
      formats: ['es', 'cjs'],
    },
    outDir: 'dist',
    rollupOptions: {
      external: [
        'vue',
        'monaco-editor',
        'element-plus',
        '@element-plus/icons-vue',
        'jsonc-parser',
        'lodash',
        /^vue\/.*/,
        /^element-plus\/.*/,
        /^@element-plus\/.*/,
        /^monaco-editor\/.*/,
        /^lodash\/.*/,
      ],
      output: [
        {
          format: 'es',
          entryFileNames: '[name].esm.js',
          chunkFileNames: 'chunks/[name]-[hash].js',
          globals: {
            vue: 'Vue',
            'monaco-editor': 'Monaco',
            'element-plus': 'ElementPlus',
            '@element-plus/icons-vue': 'ElementPlusIconsVue',
          },
        },
        {
          format: 'cjs',
          entryFileNames: '[name].cjs.js',
          chunkFileNames: 'chunks/[name]-[hash].cjs',
          globals: {
            vue: 'Vue',
            'monaco-editor': 'Monaco',
            'element-plus': 'ElementPlus',
            '@element-plus/icons-vue': 'ElementPlusIconsVue',
          },
        },
      ],
    },
  },
})
